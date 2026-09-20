"use client";

import { useEffect, useRef } from "react";
import { useDataStore } from "@/stores/useDataStore";
import { mock2026State, mock2026CarsData } from "@/data/mock2026Data";
import type { CarsData, Sector, State } from "@/types/state.type";

export const useDemoDataEngine = () => {
	const progressRef = useRef<{ [key: string]: number }>({});
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		// Initialize progress offsets for all 20 drivers so they are spread around the track
		const drivers = Object.keys(mock2026State.DriverList || {});
		drivers.forEach((num, index) => {
			// Spread drivers around the track (total 11 segments across 3 sectors)
			progressRef.current[num] = (index * 0.55) % 11;
		});

		// Deep clone initial state so we can mutate safely in memory
		const currentState: State = JSON.parse(JSON.stringify(mock2026State));
		const currentCars: CarsData = JSON.parse(JSON.stringify(mock2026CarsData));

		useDataStore.getState().setState(currentState);
		useDataStore.getState().setCarsData(currentCars);

		let tick = 0;

		intervalRef.current = setInterval(() => {
			tick++;

			// 1. Advance drivers around track sectors
			if (currentState.TimingData?.Lines) {
				Object.entries(currentState.TimingData.Lines).forEach(([racingNumber, timingDriver]) => {
					// Advance progress
					const speedOffset = 0.05 + ((21 - parseInt(timingDriver.Position)) * 0.003);
					progressRef.current[racingNumber] = (progressRef.current[racingNumber] + speedOffset) % 11;
					const currentSegIndex = Math.floor(progressRef.current[racingNumber]);

					// Update segments status (2048 = green, 2049 = purple, 2050 = yellow)
					let accumulatedSeg = 0;
					timingDriver.Sectors.forEach((sector: Sector) => {
						sector.Segments.forEach((seg) => {
							if (accumulatedSeg < currentSegIndex) {
								seg.Status = 2048; // completed
							} else if (accumulatedSeg === currentSegIndex) {
								seg.Status = 1; // in progress
							} else {
								seg.Status = 0; // not reached yet
							}
							accumulatedSeg++;
						});
					});

					// 2. Telemetry channel fluctuations for car metrics
					if (currentCars[racingNumber]) {
						const isTopSpeed = accumulatedSeg < 4 || (accumulatedSeg >= 7 && accumulatedSeg <= 9);
						const baseSpeed = isTopSpeed ? 320 : 180;
						const speedJitter = Math.floor(Math.sin(tick + parseInt(racingNumber)) * 15);
						const currentSpeed = Math.min(355, Math.max(90, baseSpeed + speedJitter));

						currentCars[racingNumber].Channels = {
							"0": Math.floor(10500 + currentSpeed * 4),
							"2": currentSpeed,
							"3": currentSpeed > 280 ? 8 : currentSpeed > 220 ? 7 : currentSpeed > 150 ? 5 : 3,
							"4": currentSpeed > 200 ? 100 : 85,
							"5": currentSpeed < 140 ? 1 : 0,
							"45": isTopSpeed ? (parseInt(timingDriver.Position) > 1 ? 12 : 0) : 0,
						};
					}
				});
			}

			// 3. Countdown timer
			if (currentState.ExtrapolatedClock) {
				currentState.ExtrapolatedClock.Utc = new Date().toISOString();
			}

			// Broadcast updated state & cars to Zustand store
			useDataStore.getState().setState({ ...currentState });
			useDataStore.getState().setCarsData({ ...currentCars });
		}, 400);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);
};
