"use client";

import { useEffect, useRef } from "react";
import { useDataStore } from "@/stores/useDataStore";
import { mock2026State, mock2026CarsData } from "@/data/mock2026Data";
import { fetchMap } from "@/lib/fetchMap";
import type { CarsData, Positions, Sector, State } from "@/types/state.type";

export const useDemoDataEngine = () => {
	const progressRef = useRef<{ [key: string]: number }>({});
	const trackProgressRef = useRef<{ [key: string]: number }>({});
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		let isMounted = true;

		// Clonar estado inicial para mutar con seguridad
		const currentState: State = JSON.parse(JSON.stringify(mock2026State));
		const currentCars: CarsData = JSON.parse(JSON.stringify(mock2026CarsData));

		useDataStore.getState().setState(currentState);
		useDataStore.getState().setCarsData(currentCars);

		const drivers = Object.keys(mock2026State.DriverList || {});
		drivers.forEach((num, index) => {
			progressRef.current[num] = (index * 0.55) % 11;
		});

		// Cargar puntos de la pista para simulación continua de alta fidelidad (GPS)
		const initSmoothTrack = async () => {
			const mapJson = await fetchMap(144); // Baku Circuit Key
			if (!mapJson || !isMounted) return;

			const totalPoints = mapJson.x.length;
			if (totalPoints === 0) return;

			// Distribuir a los 20 pilotos armónicamente alrededor del circuito
			drivers.forEach((num, index) => {
				trackProgressRef.current[num] = (index * (totalPoints / (drivers.length + 1))) % totalPoints;
			});

			let tick = 0;

			// Bucle de alta frecuencia (150ms) para un movimiento fluido a 60fps sin cortes
			intervalRef.current = setInterval(() => {
				tick++;

				const currentPositions: Positions = {};

				// 1. Simulación continua de coordenadas X, Y siguiendo la curva del asfalto
				Object.entries(currentState.TimingData?.Lines || {}).forEach(([racingNumber, timingDriver]) => {
					const positionNum = parseInt(timingDriver.Position) || 10;
					// Velocidad diferencial por posición (el líder rueda más rápido)
					const deltaPoints = 1.4 + ((22 - positionNum) * 0.05);

					if (trackProgressRef.current[racingNumber] === undefined) {
						trackProgressRef.current[racingNumber] = 0;
					}

					trackProgressRef.current[racingNumber] =
						(trackProgressRef.current[racingNumber] + deltaPoints) % totalPoints;

					const rawProg = trackProgressRef.current[racingNumber];
					const idx = Math.floor(rawProg);
					const nextIdx = (idx + 1) % totalPoints;
					const fraction = rawProg - idx;

					// Interpolación lineal fina entre puntos del circuito para eliminar escalonados
					const curX = mapJson.x[idx];
					const nxtX = mapJson.x[nextIdx];
					const curY = mapJson.y[idx];
					const nxtY = mapJson.y[nextIdx];

					const interpX = curX + (nxtX - curX) * fraction;
					const interpY = curY + (nxtY - curY) * fraction;

					currentPositions[racingNumber] = {
						Status: "OnTrack",
						X: interpX,
						Y: interpY,
						Z: 0,
					};

					// 2. Cada ~450ms (3 ticks), actualizar telemetría y segmentos de microsectores
					if (tick % 3 === 0) {
						const speedOffset = 0.05 + ((21 - positionNum) * 0.003);
						progressRef.current[racingNumber] = (progressRef.current[racingNumber] + speedOffset) % 11;
						const currentSegIndex = Math.floor(progressRef.current[racingNumber]);

						let accumulatedSeg = 0;
						timingDriver.Sectors.forEach((sector: Sector) => {
							sector.Segments.forEach((seg) => {
								if (accumulatedSeg < currentSegIndex) {
									seg.Status = 2048;
								} else if (accumulatedSeg === currentSegIndex) {
									seg.Status = 1;
								} else {
									seg.Status = 0;
								}
								accumulatedSeg++;
							});
						});

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
								"45": isTopSpeed ? (positionNum > 1 ? 12 : 0) : 0,
							};
						}
					}
				});

				// Emitir coordenadas fluidas al store
				useDataStore.getState().setPositions(currentPositions);

				if (tick % 3 === 0) {
					if (currentState.ExtrapolatedClock) {
						currentState.ExtrapolatedClock.Utc = new Date().toISOString();
					}
					useDataStore.getState().setState({ ...currentState });
					useDataStore.getState().setCarsData({ ...currentCars });
				}
			}, 150);
		};

		initSmoothTrack();

		return () => {
			isMounted = false;
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);
};
