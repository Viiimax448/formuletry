"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

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
import { NotepadText } from "lucide-react";

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

	// Responsive grid template columns
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const getGridTemplateColumns = () => {
		if (compactMode) {
			return "5.5rem 2.2rem 3.5rem 2.8rem 3.4rem auto"; // Compact layout
		}
		return carMetrics
			? "5.5rem 2.2rem 3.5rem 3.4rem 4rem 2.8rem auto 8rem"
			: "5.5rem 2.2rem 3.5rem 3.4rem 4rem 2.8rem auto";
	};

	return (
		<motion.div
			layout="position"
			onClick={() => {
				handleSelectDriver();
			}}
			className={clsx(
				// Compact table style for all devices
				"flex flex-col gap-0.5 rounded-none p-1 py-1 mb-0 select-none cursor-pointer driver-row",
				"border-0 border-b border-gray-600/30 w-fit min-w-full",
				"hover:bg-gray-800/30 shadow-none backdrop-blur-none",
				compactMode ? "h-auto min-h-[2.25rem]" : "h-auto", // Updated from min-h-[3rem]
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
					"grid items-center gap-2 driver-grid w-full",
					"md:gap-2"
				)}
				style={{
					gridTemplateColumns: getGridTemplateColumns(),
				}}
			>
				<div className="flex items-center gap-1 w-full min-w-full group/card">
					<DriverTag className="flex-1" short={driver.Tla} teamColor={driver.TeamColour} position={position} />
					<button
						onClick={(e) => {
							e.stopPropagation(); // Prevent row selection
							onOpenDriverCard();
						}}
						className="p-1 ml-1 rounded text-gray-500 hover:bg-white/10 hover:text-white transition-all"
						title="Abrir Driver Card"
					>
						<NotepadText className="w-4 h-4" />
					</button>
				</div>
				<DriverDRS
					on={carData ? hasDRS(carData[45]) : false}
					possible={carData ? possibleDRS(carData[45]) : false}
					inPit={timingDriver.InPit}
					pitOut={timingDriver.PitOut}
				/>
				<DriverTire stints={appTimingDriver?.Stints} />

				<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
				<DriverLapTime last={timingDriver.LastLapTime} best={timingDriver.BestLapTime} hasFastest={hasFastest} />
				
				<div className="text-center font-mono text-sm text-white/90 md:text-base">
					{timingDriver.NumberOfLaps}<span className="text-gray-400 ml-0.5 text-xs">L</span>
				</div>
				<DriverMiniSectors
					sectors={timingDriver.Sectors}
					bestSectors={timingStatsDriver?.BestSectors}
					className={clsx("max-md:col-span-full max-md:mt-1", compactMode && "col-span-full mt-1 w-full")}
				/>

				{carMetrics && carData && (
					<DriverCarMetrics
						carData={carData}
						className={clsx("max-md:col-span-full", compactMode && "col-span-full mt-1 w-full")}
					/>
				)}
			</div>
		</motion.div>
	);
}
