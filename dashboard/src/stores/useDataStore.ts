import { create } from "zustand";

import type { CarsData, Positions, State } from "@/types/state.type";

// main store

type Segment = { Status: number };

type DataStore = {
	state: State | null;
	carsData: CarsData | null;
	positions: Positions | null;
	bestLapSegments: Record<string, Segment[][]>;

	setState: (state: Partial<State> | null) => void;
	setCarsData: (carsData: CarsData | null) => void;
	setPositions: (positions: Positions | null) => void;
};

export const useDataStore = create<DataStore>((set) => ({
	state: null,
	carsData: null,
	positions: null,
	bestLapSegments: {},

	setState: (partialState: Partial<State> | null) =>
		set((prev) => {
			if (!partialState) return { state: null };

			let updatedBestLapSegments = prev.bestLapSegments;
			const timingLines = partialState.TimingData?.Lines;

			if (timingLines) {
				let hasChanges = false;
				const newSegmentsMap = { ...prev.bestLapSegments };

				Object.entries(timingLines).forEach(([num, timing]) => {
					const isPB =
						timing.LastLapTime?.PersonalFastest ||
						timing.LastLapTime?.OverallFastest ||
						(Boolean(timing.BestLapTime?.Value) &&
							Boolean(timing.LastLapTime?.Value) &&
							timing.BestLapTime?.Value === timing.LastLapTime?.Value);

					if (isPB && timing.Sectors && timing.Sectors.length > 0) {
						const hasValidSegments = timing.Sectors.some((s) =>
							s.Segments?.some((seg) => seg.Status > 0)
						);
						if (hasValidSegments) {
							newSegmentsMap[num] = timing.Sectors.map((s) =>
								(s.Segments || []).map((seg) => ({ Status: seg.Status }))
							);
							hasChanges = true;
						}
					}
				});

				if (hasChanges) {
					updatedBestLapSegments = newSegmentsMap;
				}
			}

			return {
				bestLapSegments: updatedBestLapSegments,
				state: {
					...(prev.state ?? {}),
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					...Object.fromEntries(
						Object.entries(partialState).filter(([_, v]) => v !== undefined)
					),
				},
			};
		}),
	setCarsData: (carsData: CarsData | null) => set({ carsData }),
	setPositions: (positions: Positions | null) => set({ positions }),
}));
