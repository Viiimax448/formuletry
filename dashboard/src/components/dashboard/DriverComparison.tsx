"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowLeftRight, Zap, Gauge, GripVertical } from "lucide-react";

import type { Driver, TimingDataDriver, TimingStatsDriver, Stint } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";
import { getCustomTeamColor, getComparisonColors } from "@/lib/teamColors";
import { compareSectors, parseTimeToSeconds, type SectorComparison } from "@/lib/timingComparison";
import TireIcon from "@/components/TireIcon";

function formatDriverShortName(driver?: Driver | null): string {
	if (!driver) return "";
	if (driver.FirstName && driver.LastName) {
		const initial = driver.FirstName.trim().charAt(0).toUpperCase();
		return `${initial}. ${driver.LastName}`;
	}
	if (driver.FullName) {
		const parts = driver.FullName.trim().split(/\s+/);
		if (parts.length > 1) {
			const initial = parts[0].charAt(0).toUpperCase();
			const lastName = parts.slice(1).join(" ");
			return `${initial}. ${lastName}`;
		}
		return driver.FullName;
	}
	if (driver.BroadcastName) {
		const parts = driver.BroadcastName.trim().split(/\s+/);
		if (parts.length > 1) {
			const initial = parts[0].charAt(0).toUpperCase();
			const lastName = parts.slice(1).join(" ");
			return `${initial}. ${lastName}`;
		}
		return driver.BroadcastName;
	}
	return driver.Tla || "";
}

type Props = {
	onClose?: () => void;
};

export default function DriverComparison({ onClose }: Props) {
	const singleDragRef = useRef<HTMLDivElement>(null);
	const dualDragRef = useRef<HTMLDivElement>(null);

	const mode = useSettingsStore((state) => state.comparisonMode);
	const setMode = useSettingsStore((state) => state.setComparisonMode);

	const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);
	const setFavoriteDrivers = useSettingsStore((state) => state.setFavoriteDrivers);
	const removeFavoriteDriver = useSettingsStore((state) => state.removeFavoriteDriver);

	const drivers = useDataStore(({ state }) => state?.DriverList);
	const driversTiming = useDataStore(({ state }) => state?.TimingData);
	const timingStats = useDataStore(({ state }) => state?.TimingStats);
	const timingAppData = useDataStore(({ state }) => state?.TimingAppData);
	const bestLapSegments = useDataStore((state) => state.bestLapSegments);

	// Cerrar con Escape
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && favoriteDrivers.length > 0) {
				setFavoriteDrivers([]);
				if (onClose) onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [favoriteDrivers, setFavoriteDrivers, onClose]);

	if (!drivers || !driversTiming) return null;

	const selectedIds = favoriteDrivers.filter((id) => !!drivers[id] && !!driversTiming.Lines[id]);

	if (selectedIds.length === 0) return null;

	// ESTADO 1: Un solo piloto seleccionado (Dynamic Island con Minisectores en Palitos)
	if (selectedIds.length === 1) {
		const singleDriver = drivers[selectedIds[0]];
		if (!singleDriver) return null;

		const singleTiming = driversTiming.Lines[selectedIds[0]];
		const teamColor = getCustomTeamColor(singleDriver.TeamColour, singleDriver.Tla);
		const teammate = Object.values(drivers).find(
			(d) => d.TeamName === singleDriver.TeamName && d.RacingNumber !== singleDriver.RacingNumber
		);

		const lapTime = singleTiming?.LastLapTime?.Value || singleTiming?.BestLapTime?.Value;
		const pos = singleTiming?.Position;

		return (
			<div
				ref={singleDragRef}
				className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none pb-4 sm:pb-6 px-3 select-none"
			>
				<motion.div
					drag
					dragConstraints={singleDragRef}
					dragMomentum={false}
					dragElastic={0.08}
					whileDrag={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.8)" }}
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ type: "spring", stiffness: 480, damping: 30 }}
					className="pointer-events-auto cursor-grab active:cursor-grabbing touch-none flex items-center justify-between gap-2 sm:gap-2.5 pl-2 pr-2.5 sm:pr-3.5 py-1.5 rounded-full bg-[#131B2A]/95 backdrop-blur-xl border border-white/[0.12] shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] text-xs text-white"
				>
					{/* Handle de arrastre sutil */}
					<div
						className="flex items-center text-white/30 hover:text-white/60 transition-colors cursor-grab active:cursor-grabbing shrink-0"
						title="Arrastrar"
					>
						<GripVertical className="w-3.5 h-3.5" />
					</div>

					{/* Piloto Info */}
					<div className="flex items-center gap-1.5 shrink-0">
						<span
							className="w-2 h-2 rounded-full shrink-0 shadow-xs"
							style={{ backgroundColor: teamColor }}
						/>
						<span className="font-sans font-bold text-white text-[12px] sm:text-[12.5px] tracking-tight whitespace-nowrap">
							{formatDriverShortName(singleDriver)}
						</span>
						{pos && (
							<span className="text-[10px] font-mono text-white/40">
								P{pos}
							</span>
						)}
					</div>

					{/* Minisectores en forma de palitos verticales (S1, S2, S3) sin fondo para ahorrar espacio */}
					<VerticalMiniSectorSticks
						sectors={singleTiming?.Sectors}
						mode={mode}
						bestLapSegments={bestLapSegments}
						driverNumber={singleDriver.RacingNumber}
					/>

					{/* Acciones */}
					<div className="flex items-center gap-1 shrink-0">
						{teammate && (
							<button
								onPointerDown={(e) => e.stopPropagation()}
								onClick={() => setFavoriteDrivers([singleDriver.RacingNumber, teammate.RacingNumber])}
								className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/[0.07] hover:bg-white/[0.12] text-white/90 border border-white/[0.08] transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
								title={`Comparar con ${teammate.FullName}`}
							>
								<Zap className="w-2.5 h-2.5 text-cyan-400" />
								<span>vs {teammate.Tla}</span>
							</button>
						)}
						<button
							onPointerDown={(e) => e.stopPropagation()}
							onClick={() => removeFavoriteDriver(singleDriver.RacingNumber)}
							className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
							title="Cancelar selección"
						>
							<X className="w-3.5 h-3.5" />
						</button>
					</div>
				</motion.div>
			</div>
		);
	}

	// ESTADO 2: Dos pilotos seleccionados (Head-to-Head HUD Flotante)
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
	const getSectorValues = (timing: TimingDataDriver, stats?: TimingStatsDriver): string[] => {
		if (mode === "last") {
			return [
				timing.Sectors?.[0]?.Value || timing.Sectors?.[0]?.PreviousValue || "--",
				timing.Sectors?.[1]?.Value || timing.Sectors?.[1]?.PreviousValue || "--",
				timing.Sectors?.[2]?.Value || timing.Sectors?.[2]?.PreviousValue || "--",
			];
		}
		return [
			stats?.BestSectors?.[0]?.Value || timing.Sectors?.[0]?.Value || "--",
			stats?.BestSectors?.[1]?.Value || timing.Sectors?.[1]?.Value || "--",
			stats?.BestSectors?.[2]?.Value || timing.Sectors?.[2]?.Value || "--",
		];
	};

	// Minisector segments by mode
	const getSectorSegments = (
		timing: TimingDataDriver,
		stats: TimingStatsDriver | undefined,
		driverNumber: string
	) => {
		return [0, 1, 2].map((idx) => {
			if (mode === "last") {
				return timing.Sectors?.[idx]?.Segments || [];
			}
			const cachedPB = bestLapSegments?.[driverNumber]?.[idx];
			if (cachedPB && cachedPB.length > 0) {
				return cachedPB;
			}
			return [];
		});
	};

	const s1Values = getSectorValues(timing1, stats1);
	const s2Values = getSectorValues(timing2, stats2);

	const s1Segments = getSectorSegments(timing1, stats1, id1);
	const s2Segments = getSectorSegments(timing2, stats2, id2);

	const comparisons = [
		compareSectors(s1Values[0], s2Values[0]),
		compareSectors(s1Values[1], s2Values[1]),
		compareSectors(s1Values[2], s2Values[2]),
	];

	// Speed Trap values
	const st1 = parseInt(timing1.Speeds?.St?.Value || stats1?.BestSpeeds?.St?.Value || "0") || null;
	const st2 = parseInt(timing2.Speeds?.St?.Value || stats2?.BestSpeeds?.St?.Value || "0") || null;

	const { color1, color2, isSameTeam } = getComparisonColors(driver1, driver2);

	const stint1 = app1?.Stints ? app1.Stints[app1.Stints.length - 1] : null;
	const stint2 = app2?.Stints ? app2.Stints[app2.Stints.length - 1] : null;

	return (
		<div
			ref={dualDragRef}
			className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none pb-3 sm:pb-5 px-2 sm:px-3 select-none"
		>
			<motion.div
				drag
				dragConstraints={dualDragRef}
				dragMomentum={false}
				dragElastic={0.08}
				whileDrag={{ scale: 1.015, boxShadow: "0 25px 60px rgba(0,0,0,0.9)" }}
				initial={{ opacity: 0, scale: 0.96 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.96 }}
				transition={{ type: "spring", stiffness: 450, damping: 30 }}
				className="pointer-events-auto cursor-grab active:cursor-grabbing touch-none w-full max-w-xl sm:max-w-2xl rounded-2xl bg-[#111726]/95 backdrop-blur-2xl border border-white/[0.10] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.10)] p-3 text-white flex flex-col gap-2"
			>
				{/* 1. Barra de Control Superior */}
				<div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
					{/* Toggle Modo: Última vs Mejor PB */}
					<div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/[0.08] text-[9.5px] font-mono">
						<button
							onPointerDown={(e) => e.stopPropagation()}
							onClick={() => setMode("last")}
							className={clsx(
								"px-2 py-0.5 rounded-md transition-all font-semibold cursor-pointer",
								mode === "last"
									? "bg-white/[0.16] text-white shadow-xs"
									: "text-white/40 hover:text-white"
							)}
						>
							ÚLTIMA
						</button>
						<button
							onPointerDown={(e) => e.stopPropagation()}
							onClick={() => setMode("best")}
							className={clsx(
								"px-2 py-0.5 rounded-md transition-all font-semibold cursor-pointer",
								mode === "best"
									? "bg-white/[0.16] text-white shadow-xs"
									: "text-white/40 hover:text-white"
							)}
						>
							MEJOR (PB)
						</button>
					</div>

					{/* Indicador de GAP Total en la barra superior */}
					{lapDelta !== null && lapDelta !== 0 && (
						<div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[9.5px] font-mono">
							<span className="text-white/40 font-semibold text-[9px]">GAP:</span>
							<span
								className="font-bold tracking-wide"
								style={{ color: lapDelta > 0 ? color1 : color2 }}
							>
								{lapDelta > 0 ? driver1.Tla : driver2.Tla}
							</span>
							<span className="text-emerald-400 font-bold tabular-nums">
								-{Math.abs(lapDelta).toFixed(3)}s
							</span>
						</div>
					)}

					{/* Botones de acción */}
					<div className="flex items-center gap-1.5">
						<button
							onPointerDown={(e) => e.stopPropagation()}
							onClick={handleSwap}
							className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[10px] font-mono text-white/80 border border-white/[0.08] transition-all cursor-pointer active:scale-95"
							title="Intercambiar orden"
						>
							<ArrowLeftRight className="w-3 h-3 text-cyan-400" />
							<span>Swap</span>
						</button>
						<button
							onPointerDown={(e) => e.stopPropagation()}
							onClick={handleClear}
							className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
							title="Cerrar"
						>
							<X className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>

				{/* 2. Sección Piloto 1 (Limpio, sin cards anidadas) */}
				<div className="flex flex-col gap-1 pt-0.5">
					{/* Fila Encabezado Piloto 1 */}
					<div className="flex items-center justify-between text-xs">
						<div className="flex items-center gap-1.5 min-w-0 pr-1">
							<span
								className="w-2 h-2 rounded-full shrink-0 shadow-xs"
								style={{ backgroundColor: color1 }}
							/>
							<span className="font-sans font-bold text-white text-[12px] tracking-tight whitespace-nowrap">
								{formatDriverShortName(driver1)}
							</span>
							<span className="text-[9.5px] font-mono text-white/40 shrink-0">
								P{timing1.Position || "-"}
							</span>
						</div>

						<div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
							{stint1?.Compound && (
								<div className="flex items-center gap-1 text-[10px] font-mono text-white/60">
									<TireIcon compound={stint1.Compound} size={12} />
									<span>{stint1.TotalLaps ?? 0}L</span>
								</div>
							)}
							{st1 && (
								<span
									className={clsx(
										"text-[9.5px] font-mono tabular-nums hidden xs:inline",
										st1 > (st2 || 0) ? "text-emerald-400 font-semibold" : "text-white/40"
									)}
								>
									{st1} km/h
								</span>
							)}
							{/* Tiempo de vuelta y delta */}
							<div className="flex items-center gap-1.5 pl-0.5">
								{lapDelta !== null && lapDelta < 0 && (
									<span className="text-rose-400 font-mono font-bold text-[10.5px] tabular-nums">
										+{Math.abs(lapDelta).toFixed(3)}s
									</span>
								)}
								<span
									className={clsx(
										"font-mono font-black text-[13px] tabular-nums",
										lapDelta !== null && lapDelta > 0 ? "text-emerald-400" : "text-white"
									)}
								>
									{lap1Time}
								</span>
							</div>
						</div>
					</div>

					{/* Sectores S1, S2, S3 con Palitos de Microsectores de Piloto 1 */}
					<div className="grid grid-cols-3 gap-2 sm:gap-3">
						{[0, 1, 2].map((idx) => {
							const val1 = s1Values[idx] || "--";
							const comp = comparisons[idx];
							const isD1OverallFastest =
								mode === "best"
									? Boolean(timing1.Sectors?.[idx]?.OverallFastest || stats1?.BestSectors?.[idx]?.Position === 1)
									: Boolean(
											(timing1.Sectors?.[idx]?.OverallFastest &&
												(timing1.Sectors?.[idx]?.Value === val1 || timing1.Sectors?.[idx]?.PreviousValue === val1)) ||
												(stats1?.BestSectors?.[idx]?.Position === 1 && stats1?.BestSectors?.[idx]?.Value === val1)
									  );
							const seg1 = s1Segments?.[idx] || [];

							return (
								<div key={`d1.s.${idx}`} className="flex flex-col gap-0.5">
									<div className="flex items-center justify-between font-mono">
										<span className="text-white/40 font-semibold text-[9px]">S{idx + 1}</span>
										<span
											className={clsx("font-bold tabular-nums text-[11px]", {
												"text-purple-400": isD1OverallFastest,
												"text-emerald-400": comp.winner === 1 && !isD1OverallFastest,
												"text-white": comp.winner !== 1 && !isD1OverallFastest && val1 !== "--",
												"text-white/30": val1 === "--",
											})}
										>
											{val1}
										</span>
									</div>
									<div className="flex items-center gap-[2px] w-full">
										{seg1.length > 0 ? (
											seg1.map((seg, sIdx) => (
												<div
													key={sIdx}
													className={clsx(
														"flex-1 h-[4px] min-w-[2.5px] rounded-full transition-all",
														{
															"bg-purple-500 shadow-[0_0_3px_rgba(168,85,247,0.6)]": seg.Status === 2051,
															"bg-emerald-400 shadow-[0_0_3px_rgba(52,211,153,0.6)]": seg.Status === 2049,
															"bg-amber-400": seg.Status === 2048 || seg.Status === 2052,
															"bg-blue-500": seg.Status === 2064,
															"bg-white/[0.10]": seg.Status === 0 || !seg.Status,
														}
													)}
												/>
											))
										) : (
											[0, 1, 2, 3].map((fIdx) => (
												<div
													key={fIdx}
													className={clsx(
														"flex-1 h-[4px] min-w-[2.5px] rounded-full",
														isD1OverallFastest
															? "bg-purple-500"
															: comp.winner === 1
															? "bg-emerald-400"
															: val1 !== "--"
															? "bg-amber-400"
															: "bg-white/[0.10]"
													)}
												/>
											))
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* 3. Franja Divisoria con Deltas de Sector (Simétrica con bordes sutiles arriba y abajo) */}
				<div className="relative my-1 flex items-center justify-between border-y border-white/[0.06] py-1 text-[9.5px] font-mono bg-white/[0.015]">
					<div className="grid grid-cols-3 gap-2 sm:gap-3 w-full text-center">
						{[0, 1, 2].map((idx) => {
							const comp = comparisons[idx];
							if (comp.delta === null) return <div key={`delta.${idx}`} />;
							const isD1Faster = comp.winner === 1;
							const isD2Faster = comp.winner === 2;

							if (isD1Faster) {
								return (
									<div key={`delta.${idx}`} className="flex items-center justify-center">
										<div className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-mono whitespace-nowrap">
											<span
												className="w-1.5 h-1.5 rounded-full shrink-0 shadow-xs"
												style={{ backgroundColor: color1 }}
											/>
											<span className="font-bold text-white/90 tracking-wide">
												{driver1.Tla}
											</span>
											<span className="text-emerald-400 font-bold tabular-nums">
												-{comp.delta.toFixed(3)}s
											</span>
										</div>
									</div>
								);
							}

							if (isD2Faster) {
								return (
									<div key={`delta.${idx}`} className="flex items-center justify-center">
										<div className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-mono whitespace-nowrap">
											<span
												className="w-1.5 h-1.5 rounded-full shrink-0 shadow-xs"
												style={{ backgroundColor: color2 }}
											/>
											<span className="font-bold text-white/90 tracking-wide">
												{driver2.Tla}
											</span>
											<span className="text-emerald-400 font-bold tabular-nums">
												-{comp.delta.toFixed(3)}s
											</span>
										</div>
									</div>
								);
							}

							return (
								<div key={`delta.${idx}`} className="flex items-center justify-center text-[9.5px] text-white/30 font-mono">
									= 0.000s
								</div>
							);
						})}
					</div>
				</div>

				{/* 4. Sección Piloto 2 (Limpio, sin cards anidadas) */}
				<div className="flex flex-col gap-1 pb-0.5">
					{/* Fila Encabezado Piloto 2 */}
					<div className="flex items-center justify-between text-xs">
						<div className="flex items-center gap-1.5 min-w-0 pr-1">
							<span
								className="w-2 h-2 rounded-full shrink-0 shadow-xs"
								style={{ backgroundColor: color2 }}
							/>
							<span className="font-sans font-bold text-white text-[12px] tracking-tight whitespace-nowrap">
								{formatDriverShortName(driver2)}
							</span>
							<span className="text-[9.5px] font-mono text-white/40 shrink-0">
								P{timing2.Position || "-"}
							</span>
						</div>

						<div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
							{stint2?.Compound && (
								<div className="flex items-center gap-1 text-[10px] font-mono text-white/60">
									<TireIcon compound={stint2.Compound} size={12} />
									<span>{stint2.TotalLaps ?? 0}L</span>
								</div>
							)}
							{st2 && (
								<span
									className={clsx(
										"text-[9.5px] font-mono tabular-nums hidden xs:inline",
										st2 > (st1 || 0) ? "text-emerald-400 font-semibold" : "text-white/40"
									)}
								>
									{st2} km/h
								</span>
							)}
							{/* Tiempo de vuelta y delta */}
							<div className="flex items-center gap-1.5 pl-0.5">
								{lapDelta !== null && lapDelta > 0 && (
									<span className="text-rose-400 font-mono font-bold text-[10.5px] tabular-nums">
										+{lapDelta.toFixed(3)}s
									</span>
								)}
								<span
									className={clsx(
										"font-mono font-black text-[13px] tabular-nums",
										lapDelta !== null && lapDelta < 0 ? "text-emerald-400" : "text-white"
									)}
								>
									{lap2Time}
								</span>
							</div>
						</div>
					</div>

					{/* Sectores S1, S2, S3 con Palitos de Microsectores de Piloto 2 */}
					<div className="grid grid-cols-3 gap-2 sm:gap-3">
						{[0, 1, 2].map((idx) => {
							const val2 = s2Values[idx] || "--";
							const comp = comparisons[idx];
							const isD2OverallFastest =
								mode === "best"
									? Boolean(timing2.Sectors?.[idx]?.OverallFastest || stats2?.BestSectors?.[idx]?.Position === 1)
									: Boolean(
											(timing2.Sectors?.[idx]?.OverallFastest &&
												(timing2.Sectors?.[idx]?.Value === val2 || timing2.Sectors?.[idx]?.PreviousValue === val2)) ||
												(stats2?.BestSectors?.[idx]?.Position === 1 && stats2?.BestSectors?.[idx]?.Value === val2)
									  );
							const seg2 = s2Segments?.[idx] || [];

							return (
								<div key={`d2.s.${idx}`} className="flex flex-col gap-1">
									<div className="flex items-center justify-between text-[11px] font-mono">
										<span className="text-white/40 font-semibold text-[10px]">S{idx + 1}</span>
										<span
											className={clsx("font-bold tabular-nums text-xs", {
												"text-purple-400": isD2OverallFastest,
												"text-emerald-400": comp.winner === 2 && !isD2OverallFastest,
												"text-white": comp.winner !== 2 && !isD2OverallFastest && val2 !== "--",
												"text-white/30": val2 === "--",
											})}
										>
											{val2}
										</span>
									</div>
									<div className="flex items-center gap-[2px] w-full">
										{seg2.length > 0 ? (
											seg2.map((seg, sIdx) => (
												<div
													key={sIdx}
													className={clsx(
														"flex-1 h-[4.5px] min-w-[3px] rounded-full transition-all",
														{
															"bg-purple-500 shadow-[0_0_3px_rgba(168,85,247,0.6)]": seg.Status === 2051,
															"bg-emerald-400 shadow-[0_0_3px_rgba(52,211,153,0.6)]": seg.Status === 2049,
															"bg-amber-400": seg.Status === 2048 || seg.Status === 2052,
															"bg-blue-500": seg.Status === 2064,
															"bg-white/[0.10]": seg.Status === 0 || !seg.Status,
														}
													)}
												/>
											))
										) : (
											[0, 1, 2, 3].map((fIdx) => (
												<div
													key={fIdx}
													className={clsx(
														"flex-1 h-[4.5px] min-w-[3px] rounded-full",
														isD2OverallFastest
															? "bg-purple-500"
															: comp.winner === 2
															? "bg-emerald-400"
															: val2 !== "--"
															? "bg-amber-400"
															: "bg-white/[0.10]"
													)}
												/>
											))
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

// Minisectores en forma de palitos verticales compactos (estilo telemetría F1 / captura de usuario)
function VerticalMiniSectorSticks({
	sectors,
	mode = "last",
	bestLapSegments,
	driverNumber,
}: {
	sectors?: TimingDataDriver["Sectors"];
	mode?: "last" | "best";
	bestLapSegments?: { [driver: string]: { Status: number }[][] };
	driverNumber?: string;
}) {
	const sectorList = [0, 1, 2].map((idx) => {
		if (mode === "best" && driverNumber && bestLapSegments?.[driverNumber]?.[idx]?.length) {
			return bestLapSegments[driverNumber][idx];
		}
		return sectors?.[idx]?.Segments || [];
	});

	return (
		<div
			className="flex items-center gap-1.5 shrink-0"
			title="Microsectores de la vuelta (S1 • S2 • S3)"
		>
			{[0, 1, 2].map((sectorIdx) => {
				const segments = sectorList[sectorIdx];
				const fallback = sectors?.[sectorIdx];
				const isPurple = fallback?.OverallFastest;
				const isGreen = fallback?.PersonalFastest;

				return (
					<div key={`sector.sticks.${sectorIdx}`} className="flex items-center gap-[1.5px]">
						{segments.length > 0 ? (
							segments.map((seg, sIdx) => {
								const st = seg.Status;
								return (
									<div
										key={sIdx}
										className={clsx(
											"w-[2px] h-3.5 rounded-full transition-all",
											{
												"bg-purple-500 shadow-[0_0_3px_rgba(168,85,247,0.7)]": st === 2051,
												"bg-emerald-400 shadow-[0_0_3px_rgba(52,211,153,0.7)]": st === 2049,
												"bg-amber-400": st === 2048 || st === 2052,
												"bg-blue-500": st === 2064,
												"bg-white/[0.12]": st === 0 || !st,
											}
										)}
									/>
								);
							})
						) : (
							/* Fallback: 4 palitos reflejando el estado del sector completo */
							[0, 1, 2, 3].map((fIdx) => (
								<div
									key={fIdx}
									className={clsx(
										"w-[2px] h-3.5 rounded-full transition-all",
										isPurple
											? "bg-purple-500 shadow-[0_0_3px_rgba(168,85,247,0.7)]"
											: isGreen
											? "bg-emerald-400 shadow-[0_0_3px_rgba(52,211,153,0.7)]"
											: fallback?.Value
											? "bg-amber-400"
											: "bg-white/[0.12]"
									)}
								/>
							))
						)}
					</div>
				);
			})}
		</div>
	);
}
