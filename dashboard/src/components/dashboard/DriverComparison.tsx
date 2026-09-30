"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { motion } from "motion/react";
import { X, ArrowLeftRight, Gauge, Zap } from "lucide-react";

import type { Driver, TimingDataDriver, TimingStatsDriver, Stint } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";
import { getCustomTeamColor, getComparisonColors } from "@/lib/teamColors";
import { compareSectors, parseTimeToSeconds } from "@/lib/timingComparison";
import TireIcon from "@/components/TireIcon";

type Props = {
	onClose?: () => void;
};

export default function DriverComparison({ onClose }: Props) {
	const [mode, setMode] = useState<"last" | "best">("last");

	const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);
	const setFavoriteDrivers = useSettingsStore((state) => state.setFavoriteDrivers);
	const removeFavoriteDriver = useSettingsStore((state) => state.removeFavoriteDriver);

	const drivers = useDataStore(({ state }) => state?.DriverList);
	const driversTiming = useDataStore(({ state }) => state?.TimingData);
	const timingStats = useDataStore(({ state }) => state?.TimingStats);
	const timingAppData = useDataStore(({ state }) => state?.TimingAppData);

	if (!drivers || !driversTiming) return null;

	const selectedIds = favoriteDrivers.filter((id) => !!drivers[id] && !!driversTiming.Lines[id]);

	if (selectedIds.length === 0) return null;

	// Single driver selected helper
	if (selectedIds.length === 1) {
		const singleDriver = drivers[selectedIds[0]];
		if (!singleDriver) return null;

		const teamColor = getCustomTeamColor(singleDriver.TeamColour, singleDriver.Tla);
		const teammate = Object.values(drivers).find(
			(d) => d.TeamName === singleDriver.TeamName && d.RacingNumber !== singleDriver.RacingNumber
		);

		return (
			<motion.div
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 6 }}
				className="flex items-center justify-between gap-2 px-3.5 py-2 mt-2 rounded-xl bg-[#0f131d] border border-gray-800/80 text-xs"
			>
				<div className="flex items-center gap-2">
					<div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamColor }} />
					<span className="text-gray-300">
						<strong className="text-white font-mono">{singleDriver.FullName}</strong> (1/2 seleccionado).{" "}
						<span className="text-gray-500">Selecciona otro piloto para comparar.</span>
					</span>
				</div>

				<div className="flex items-center gap-2">
					{teammate && (
						<button
							onClick={() => setFavoriteDrivers([singleDriver.RacingNumber, teammate.RacingNumber])}
							className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 transition-colors cursor-pointer flex items-center gap-1"
						>
							<Zap className="w-3 h-3 text-sky-400" />
							<span>vs {teammate.Tla} ({teammate.LastName})</span>
						</button>
					)}
					<button
						onClick={() => removeFavoriteDriver(singleDriver.RacingNumber)}
						className="text-gray-400 hover:text-white p-1"
						title="Cerrar"
					>
						<X className="w-3.5 h-3.5" />
					</button>
				</div>
			</motion.div>
		);
	}

	const id1 = selectedIds[0];
	const id2 = selectedIds[1];

	const driver1 = drivers[id1];
	const driver2 = drivers[id2];
	const timing1 = driversTiming.Lines[id1];
	const timing2 = driversTiming.Lines[id2];
	const stats1 = timingStats?.Lines[id1];
	const stats2 = timingStats?.Lines[id2];
	const app1 = timingAppData?.Lines[id1];
	const app2 = timingAppData?.Lines[id2];

	if (!driver1 || !driver2 || !timing1 || !timing2) return null;

	const handleSwap = () => {
		setFavoriteDrivers([id2, id1, ...selectedIds.slice(2)]);
	};

	const handleClear = () => {
		if (onClose) onClose();
		setFavoriteDrivers([]);
	};

	// Lap times by mode
	const lap1Time = mode === "last"
		? (timing1.LastLapTime?.Value || timing1.BestLapTime?.Value || "--:--.---")
		: (timing1.BestLapTime?.Value || stats1?.PersonalBestLapTime?.Value || timing1.LastLapTime?.Value || "--:--.---");

	const lap2Time = mode === "last"
		? (timing2.LastLapTime?.Value || timing2.BestLapTime?.Value || "--:--.---")
		: (timing2.BestLapTime?.Value || stats2?.PersonalBestLapTime?.Value || timing2.LastLapTime?.Value || "--:--.---");

	const lap1Sec = parseTimeToSeconds(lap1Time);
	const lap2Sec = parseTimeToSeconds(lap2Time);
	const lapDelta = lap1Sec !== null && lap2Sec !== null ? lap2Sec - lap1Sec : null;

	// Sector values by mode
	const getSectorValues = (timing: TimingDataDriver, stats?: TimingStatsDriver) => {
		if (mode === "last") {
			return [
				timing.Sectors?.[0]?.Value || timing.Sectors?.[0]?.PreviousValue,
				timing.Sectors?.[1]?.Value || timing.Sectors?.[1]?.PreviousValue,
				timing.Sectors?.[2]?.Value || timing.Sectors?.[2]?.PreviousValue,
			];
		}
		return [
			stats?.BestSectors?.[0]?.Value || timing.Sectors?.[0]?.Value,
			stats?.BestSectors?.[1]?.Value || timing.Sectors?.[1]?.Value,
			stats?.BestSectors?.[2]?.Value || timing.Sectors?.[2]?.Value,
		];
	};

	const s1Values = getSectorValues(timing1, stats1);
	const s2Values = getSectorValues(timing2, stats2);

	const comparisons = [
		compareSectors(s1Values[0], s2Values[0]),
		compareSectors(s1Values[1], s2Values[1]),
		compareSectors(s1Values[2], s2Values[2]),
	];

	// Speed Trap values
	const st1 = parseInt(timing1.Speeds?.St?.Value || stats1?.BestSpeeds?.St?.Value || "0") || null;
	const st2 = parseInt(timing2.Speeds?.St?.Value || stats2?.BestSpeeds?.St?.Value || "0") || null;

	const { color1, color2, isSameTeam } = getComparisonColors(driver1, driver2);

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 8 }}
			transition={{ duration: 0.2 }}
			className="w-full mt-2.5"
		>
			{/* Top Bar: Mode Toggle + Actions */}
			<div className="flex items-center justify-between gap-2 mb-2 px-0.5">
				{/* Mode Tabs */}
				<div className="flex items-center bg-[#0d111a] p-0.5 rounded-lg border border-gray-800/80">
					<button
						onClick={() => setMode("last")}
						className={clsx(
							"px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-colors cursor-pointer",
							mode === "last"
								? "bg-sky-500 text-black shadow-xs"
								: "text-gray-400 hover:text-white"
						)}
					>
						ÚLTIMA VUELTA
					</button>
					<button
						onClick={() => setMode("best")}
						className={clsx(
							"px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-colors cursor-pointer",
							mode === "best"
								? "bg-sky-500 text-black shadow-xs"
								: "text-gray-400 hover:text-white"
						)}
					>
						MEJOR VUELTA (PB)
					</button>
				</div>

				{/* Same team badge indicator */}
				{isSameTeam && (
					<div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
						<span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color1 }} />
						<span>{driver1.Tla}</span>
						<span className="text-neutral-500">vs</span>
						<span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color2 }} />
						<span>{driver2.Tla}</span>
						<span className="text-neutral-500 font-sans">({driver1.TeamName})</span>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex items-center gap-1.5">
					<button
						onClick={handleSwap}
						className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono text-gray-300 hover:text-white bg-[#0f131d] border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
						title="Intercambiar pilotos"
					>
						<ArrowLeftRight className="w-3 h-3 text-sky-400" />
						<span>Swap</span>
					</button>
					<button
						onClick={handleClear}
						className="p-1.5 rounded-md text-gray-400 hover:text-red-400 bg-[#0f131d] border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
						title="Cerrar comparativa"
					>
						<X className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>

			{/* 2 Comparison Cards Side-by-Side */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
				<CleanDriverCard
					driver={driver1}
					timing={timing1}
					stats={stats1}
					appTiming={app1}
					isDriver1={true}
					customColor={color1}
					lapTime={lap1Time}
					lapDelta={lapDelta !== null ? (lapDelta < 0 ? Math.abs(lapDelta) : null) : null}
					isFasterOverall={lapDelta !== null ? lapDelta > 0 : false}
					comparisons={comparisons}
					sectorValues={s1Values}
					speedTrap={st1}
					isFasterSpeed={st1 !== null && st2 !== null ? st1 > st2 : false}
				/>
				<CleanDriverCard
					driver={driver2}
					timing={timing2}
					stats={stats2}
					appTiming={app2}
					isDriver1={false}
					customColor={color2}
					lapTime={lap2Time}
					lapDelta={lapDelta !== null ? (lapDelta > 0 ? lapDelta : null) : null}
					isFasterOverall={lapDelta !== null ? lapDelta < 0 : false}
					comparisons={comparisons}
					sectorValues={s2Values}
					speedTrap={st2}
					isFasterSpeed={st1 !== null && st2 !== null ? st2 > st1 : false}
				/>
			</div>
		</motion.div>
	);
}

// Clean Card aligned with exact user specifications
type CardProps = {
	driver: Driver;
	timing: TimingDataDriver;
	stats?: TimingStatsDriver;
	appTiming?: { Stints?: Stint[]; GridPos?: string };
	isDriver1: boolean;
	customColor?: string;
	lapTime: string;
	lapDelta: number | null;
	isFasterOverall: boolean;
	comparisons: ReturnType<typeof compareSectors>[];
	sectorValues: (string | undefined)[];
	speedTrap: number | null;
	isFasterSpeed: boolean;
};

function CleanDriverCard({
	driver,
	timing,
	stats,
	appTiming,
	isDriver1,
	customColor,
	lapTime,
	lapDelta,
	isFasterOverall,
	comparisons,
	sectorValues,
	speedTrap,
	isFasterSpeed,
}: CardProps) {
	const teamColor = customColor || getCustomTeamColor(driver.TeamColour, driver.Tla);
	const currentStint = appTiming?.Stints ? appTiming.Stints[appTiming.Stints.length - 1] : null;
	const lapCount = timing.NumberOfLaps || timing.Line || 0;

	return (
		<div className="relative flex flex-col rounded-xl bg-[#0f131d] border border-[#1c2232] overflow-hidden p-3 select-none justify-between gap-2.5 shadow-sm">
			{/* Left Team Color Accent Bar */}
			<div
				className="absolute left-0 top-0 bottom-0 w-[4.5px]"
				style={{ backgroundColor: teamColor }}
			/>

			{/* 1. HEADER: Driver Info (Left) + Lap Time & Delta (Right) */}
			<div className="flex items-center justify-between gap-2 pl-1.5">
				{/* Driver Identity */}
				<div className="min-w-0">
					<div className="flex items-center gap-1.5">
						<div
							className="w-2.5 h-2.5 rounded-full shrink-0"
							style={{ backgroundColor: teamColor }}
						/>
						<h4 className="font-extrabold text-sm sm:text-[14.5px] text-white tracking-wide uppercase truncate font-sans">
							{driver.FullName || driver.BroadcastName}
						</h4>
					</div>
					<div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono text-gray-400 pl-4">
						<span>L{lapCount}</span>
						<span>•</span>
						<span>P{timing.Position || "-"}</span>
					</div>
				</div>

				{/* Lap Time & Delta */}
				<div className="text-right shrink-0">
					<span
						className={clsx(
							"font-mono font-black text-base sm:text-lg tabular-nums tracking-tight",
							isFasterOverall ? "text-emerald-400" : "text-white"
						)}
					>
						{lapTime}
					</span>
					{lapDelta !== null && (
						<span className="text-[10.5px] font-mono font-bold text-red-400 block -mt-0.5">
							+{lapDelta.toFixed(3)}s
						</span>
					)}
				</div>
			</div>

			{/* 2. SECTORS & MINISECTORS: S and Time Centered Directly Above Corresponding Sector Segments */}
			<div className="grid grid-cols-3 gap-2 pl-1.5">
				{[0, 1, 2].map((idx) => {
					const sectorLabel = `S${idx + 1}`;
					const sectorVal = sectorValues[idx] || "--";
					const comp = comparisons[idx];
					const isWinner = (isDriver1 && comp.winner === 1) || (!isDriver1 && comp.winner === 2);
					const isOverallFastest = timing.Sectors?.[idx]?.OverallFastest || stats?.BestSectors?.[idx]?.Position === 1;
					const sectorSegments = timing.Sectors?.[idx]?.Segments || [];

					return (
						<div key={sectorLabel} className="flex flex-col items-center gap-1.5">
							{/* Centered Sector Pill with Subtle Dark Background */}
							<div className="w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-md bg-[#131824] border border-[#1d2436] text-xs font-mono">
								<span className="text-gray-400 font-semibold text-[11px]">{sectorLabel}</span>
								<span
									className={clsx("font-bold tabular-nums text-xs sm:text-[13px]", {
										"text-violet-400": isOverallFastest,
										"text-emerald-400": isWinner && !isOverallFastest,
										"text-white": !isWinner && !isOverallFastest && sectorVal !== "--",
										"text-gray-500": sectorVal === "--",
									})}
								>
									{sectorVal}
								</span>
							</div>

							{/* Minisector segments for THIS sector directly underneath */}
							<div className="flex items-center gap-[2px] w-full justify-center">
								{sectorSegments.length > 0 ? (
									sectorSegments.map((seg, segIdx) => (
										<div
											key={`seg.${idx}.${segIdx}`}
											className={clsx(
												"flex-1 h-3 sm:h-3.5 min-w-[3px] rounded-full transition-colors duration-150",
												{
													// Yellow/Orange (standard / no improvement)
													"bg-[#f59e0b]": seg.Status === 2048 || seg.Status === 2052,
													// Green (personal best)
													"bg-[#10b981]": seg.Status === 2049,
													// Purple (overall fastest in session)
													"bg-[#8b5cf6]": seg.Status === 2051,
													// Blue
													"bg-[#3b82f6]": seg.Status === 2064,
													// Unset / Inactive
													"bg-[#1c2230]": seg.Status === 0 || !seg.Status,
												}
											)}
										/>
									))
								) : (
									<div
										className={clsx("w-full h-2.5 rounded-full", {
											"bg-violet-600": isOverallFastest,
											"bg-emerald-500": isWinner,
											"bg-amber-500": !isWinner && !isOverallFastest && sectorVal !== "--",
											"bg-zinc-800": sectorVal === "--",
										})}
									/>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* 3. FOOTER: Tire Stint & Speed Trap */}
			<div className="flex items-center justify-between pt-2 border-t border-gray-800/60 pl-1.5 text-[11px] font-mono text-gray-400">
				{/* Tire compound & stint age */}
				<div className="flex items-center gap-1.5">
					{currentStint?.Compound ? (
						<div className="flex items-center gap-1.5">
							<TireIcon compound={currentStint.Compound} size={14} />
							<span className="text-gray-200 font-semibold uppercase">
								{currentStint.Compound} <span className="text-gray-400">({currentStint.TotalLaps ?? 0}L)</span>
							</span>
						</div>
					) : (
						<span className="text-gray-500">Neumático N/D</span>
					)}
				</div>

				{/* Speed Trap */}
				{speedTrap ? (
					<div className="flex items-center gap-1">
						<Gauge className="w-3.5 h-3.5 text-gray-500" />
						<span className="text-gray-400">Speed Trap:</span>
						<span className={clsx("font-bold", isFasterSpeed ? "text-emerald-400" : "text-white")}>
							{speedTrap} km/h
						</span>
					</div>
				) : (
					<span className="text-gray-500">-- km/h</span>
				)}
			</div>
		</div>
	);
}
