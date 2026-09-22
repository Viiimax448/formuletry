"use client";

import clsx from "clsx";
import { motion } from "motion/react";

import type { Driver, TimingDataDriver } from "@/types/state.type";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverLapTime from "./DriverLapTime";
import DriverCarMetrics from "./DriverCarMetrics";

type Props = {
	position: number;
	driver: Driver;
	timingDriver: TimingDataDriver;
	isSelected: boolean;
	handleSelectDriver: () => void;
	onOpenDriverCard: () => void;
};

const hasDRS = (drs: number) => drs > 9;

const possibleDRS = (drs: number) => drs === 8;

const inDangerZone = (position: number, sessionPart: number) => {
	switch (sessionPart) {
		case 1:
			return position > 15;
		case 2:
			return position > 10;
		case 3:
		default:
			return false;
	}
};

export default function Driver({ driver, timingDriver, position, isSelected, handleSelectDriver, onOpenDriverCard }: Props) {
	const sessionPart = useDataStore((state) => state.state?.TimingData?.SessionPart);
	const timingStatsDriver = useDataStore((state) => state.state?.TimingStats?.Lines[driver.RacingNumber]);
	const appTimingDriver = useDataStore((state) => state.state?.TimingAppData?.Lines[driver.RacingNumber]);
	const carData = useDataStore((state) => (state?.carsData ? state.carsData[driver.RacingNumber].Channels : undefined));

	const hasFastest = timingStatsDriver?.PersonalBestLapTime.Position == 1;

	const carMetrics = useSettingsStore((state) => state.carMetrics);

	const favoriteDriver = useSettingsStore((state) => state.favoriteDrivers.includes(timingDriver.RacingNumber));

	const compactMode = useSettingsStore((state) => state.compactMode);

	const getGridTemplateColumns = () => {
		if (compactMode) {
			return "4.8rem 2.2rem 3.8rem 3.6rem 4.5rem auto"; // Compact layout
		}
		return carMetrics
			? "4.8rem 2.2rem 3.8rem 3.6rem 4.5rem 2.2rem auto 9rem"
			: "4.8rem 2.2rem 3.8rem 3.6rem 4.5rem 2.2rem auto";
	};

	const hasSectorsData = timingDriver.Sectors && timingDriver.Sectors.some(
		(s) => !!s.Value || !!s.PreviousValue || s.Segments?.some((seg) => seg.Status > 0),
	);
	const showBottomRow = compactMode && (hasSectorsData || (carMetrics && carData));

	return (
		<motion.div
			layout="position"
			onClick={() => {
				handleSelectDriver();
			}}
			className={clsx(
				// Ultra-compact dense table row (~30-32px)
				"flex flex-col gap-0 rounded-none px-1 py-0.5 mb-0 select-none cursor-pointer driver-row",
				"border-0 border-b border-gray-800/60 w-fit min-w-full",
				"hover:bg-gray-800/40 shadow-none backdrop-blur-none",
				compactMode ? "h-auto min-h-[1.75rem]" : "h-auto",
				{
					"opacity-50": timingDriver.KnockedOut || timingDriver.Retired || timingDriver.Stopped,
					"bg-sky-800/20 border-sky-600/30": favoriteDriver,
					"bg-violet-800/20 border-violet-600/30": hasFastest,
					"bg-red-800/20 border-red-600/30": sessionPart != undefined && inDangerZone(position, sessionPart),
					"bg-indigo-500/20": isSelected, // Highlight selected row
				}
			)}
		>
			<div
				className={clsx(
					"grid items-center gap-1.5 driver-grid w-full",
					"md:gap-2"
				)}
				style={{
					gridTemplateColumns: getGridTemplateColumns(),
				}}
			>
				<div className="flex items-center w-full min-w-full">
					<DriverTag
						short={driver.Tla}
						teamColor={driver.TeamColour}
						position={position}
						onOpenDriverCard={onOpenDriverCard}
					/>
				</div>
				<DriverDRS
					on={carData ? hasDRS(carData[45]) : false}
					possible={carData ? possibleDRS(carData[45]) : false}
					inPit={timingDriver.InPit}
					pitOut={timingDriver.PitOut}
				/>
				<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
				<DriverTire stints={appTimingDriver?.Stints} />
				<DriverLapTime last={timingDriver.LastLapTime} best={timingDriver.BestLapTime} hasFastest={hasFastest} />
				
				<div className="text-center font-mono text-sm font-semibold text-white/90">
					{timingDriver.NumberOfLaps}<span className="text-gray-400 ml-0.5 text-[10.5px]">L</span>
				</div>

				{!compactMode && (
					<>
						<DriverMiniSectors
							sectors={timingDriver.Sectors}
							bestSectors={timingStatsDriver?.BestSectors}
							className="shrink-0"
						/>

						{carMetrics && carData && (
							<DriverCarMetrics
								carData={carData}
								className="shrink-0"
							/>
						)}
					</>
				)}
			</div>

			{showBottomRow && (
				<div className="flex items-center justify-between gap-2 pt-0.5 pb-1 px-1 w-full">
					<DriverMiniSectors
						sectors={timingDriver.Sectors}
						bestSectors={timingStatsDriver?.BestSectors}
						className="gap-2.5"
					/>

					{carMetrics && carData && (
						<DriverCarMetrics
							carData={carData}
							className="shrink-0 scale-90 origin-right"
						/>
					)}
				</div>
			)}
		</motion.div>
	);
}
