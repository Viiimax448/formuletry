import React from "react";
import { X, Disc, ArrowUp, ArrowDown } from "lucide-react";
import clsx from "clsx";
import { useDataStore } from "@/stores/useDataStore";
import DriverMiniSectors from "../driver/DriverMiniSectors";
import DriverTag from "../driver/DriverTag";
import DriverGap from "../driver/DriverGap";
import DriverTire from "../driver/DriverTire";
import DriverLapTime from "../driver/DriverLapTime";
import TireIcon from "../TireIcon";
import { sortPos } from "@/lib/sorting";
import { getCustomTeamColor } from "@/lib/teamColors";
import type { Driver, TimingDataDriver, Stint } from "@/types/state.type";

interface DriverCardModalProps {
	driver: Driver;
	timingDriver: TimingDataDriver;
	onClose: () => void;
}

const DriverCardModal: React.FC<DriverCardModalProps> = ({ driver, timingDriver, onClose }) => {
	// 1. Convertir número a string
	const driverNumStr = String(driver.RacingNumber);

	// 2. Extraer datos del store
	const timingStatsDriver = useDataStore((state) => state.state?.TimingStats?.Lines[driverNumStr]);
	const appTimingDriver = useDataStore((state) => state.state?.TimingAppData?.Lines[driverNumStr]);
	const allDrivers = useDataStore((state) => state.state?.DriverList);
	const allTiming = useDataStore((state) => state.state?.TimingData?.Lines);
	const sessionPart = useDataStore((state) => state.state?.TimingData?.SessionPart);
	const allTimingAppData = useDataStore((state) => state.state?.TimingAppData?.Lines);
	const allTimingStats = useDataStore((state) => state.state?.TimingStats?.Lines);

	const teamColor = getCustomTeamColor(driver.TeamColour, driver.Tla);

	// 3. Stints y Neumáticos
	const stints: Stint[] = appTimingDriver?.Stints || [];
	const currentStintIndex = stints.length > 0 ? stints.length - 1 : 0;
	const currentStint = stints[currentStintIndex];
	const tyreCompound = currentStint?.Compound || "N/A";
	const isNewTyre = currentStint?.New === "true" || currentStint?.New === "TRUE";
	const tyreLaps = currentStint?.TotalLaps ?? 0;
	const pitCount = stints.length > 1 ? stints.length - 1 : 0;

	// 4. Ganancia de puestos (GridPos vs Position actual)
	const currentPos = Number(timingDriver.Position);
	const gridPos = appTimingDriver?.GridPos ? Number(appTimingDriver.GridPos) : null;
	const posDiff = gridPos && !isNaN(gridPos) && currentPos && !isNaN(currentPos) ? gridPos - currentPos : null;

	// Helper de estilos por compuesto (sin bordes)
	const getCompoundStyle = (compound?: string) => {
		const c = (compound || "").toUpperCase();
		if (c.includes("SOFT")) {
			return {
				bg: "bg-red-500",
				badgeText: "text-red-400",
				textColor: "text-white",
				name: "SOFT",
			};
		}
		if (c.includes("MEDIUM")) {
			return {
				bg: "bg-yellow-400",
				badgeText: "text-yellow-400",
				textColor: "text-black",
				name: "MEDIUM",
			};
		}
		if (c.includes("HARD")) {
			return {
				bg: "bg-white",
				badgeText: "text-white",
				textColor: "text-black",
				name: "HARD",
			};
		}
		if (c.includes("INTER") || c.includes("INTERMEDIATE")) {
			return {
				bg: "bg-emerald-500",
				badgeText: "text-emerald-400",
				textColor: "text-black",
				name: "INTER",
			};
		}
		if (c.includes("WET")) {
			return {
				bg: "bg-blue-500",
				badgeText: "text-blue-400",
				textColor: "text-white",
				name: "WET",
			};
		}
		return {
			bg: "bg-gray-600",
			badgeText: "text-gray-400",
			textColor: "text-white",
			name: compound || "N/A",
		};
	};

	// Cálculo de rangos de vueltas de los stints
	let cumulativeLaps = 0;
	const stintRanges = stints.map((stint, idx) => {
		const startLap = cumulativeLaps + 1;
		const lapsInStint = stint.TotalLaps ?? 0;
		cumulativeLaps += lapsInStint;
		return {
			...stint,
			startLap,
			endLap: cumulativeLaps,
			laps: lapsInStint,
			isCurrent: idx === stints.length - 1,
		};
	});

	// Helper para el color de texto del compuesto
	const getTyreColor = (compound: string) => {
		const c = compound.toUpperCase();
		if (c.includes("SOFT")) return "text-red-500";
		if (c.includes("MEDIUM")) return "text-yellow-400";
		if (c.includes("HARD")) return "text-white";
		if (c.includes("INTER") || c.includes("INTERMEDIATE")) return "text-emerald-400";
		if (c.includes("WET")) return "text-blue-400";
		return "text-white";
	};

	// 5. Pilotos adelante, actual y atrás para la Batalla en Pista
	let aheadTiming: TimingDataDriver | null = null;
	let aheadDriver: Driver | null = null;
	let aheadAppTiming: any = null;
	let aheadStats: any = null;
	let aheadPos: number | undefined = undefined;

	let behindTiming: TimingDataDriver | null = null;
	let behindDriver: Driver | null = null;
	let behindAppTiming: any = null;
	let behindStats: any = null;
	let behindPos: number | undefined = undefined;

	if (allTiming && allDrivers) {
		const sortedLines = Object.values(allTiming).sort(sortPos);
		const myIndex = sortedLines.findIndex((l) => String(l.RacingNumber) === driverNumStr);

		if (myIndex > 0) {
			aheadTiming = sortedLines[myIndex - 1];
			aheadDriver = allDrivers[aheadTiming.RacingNumber];
			aheadPos = Number(aheadTiming.Position) || myIndex;
			aheadAppTiming = allTimingAppData?.[aheadTiming.RacingNumber];
			aheadStats = allTimingStats?.[aheadTiming.RacingNumber];
		}

		if (myIndex >= 0 && myIndex < sortedLines.length - 1) {
			behindTiming = sortedLines[myIndex + 1];
			behindDriver = allDrivers[behindTiming.RacingNumber];
			behindPos = Number(behindTiming.Position) || myIndex + 2;
			behindAppTiming = allTimingAppData?.[behindTiming.RacingNumber];
			behindStats = allTimingStats?.[behindTiming.RacingNumber];
		}
	}

	const renderBattleRow = (
		rowDriver: Driver,
		rowTiming: TimingDataDriver,
		rowAppTiming: any,
		rowStats: any,
		rowPos?: number,
		isCurrent?: boolean,
	) => {
		const hasFastest = rowStats?.PersonalBestLapTime?.Position == 1;

		return (
			<div
				className="grid items-center gap-1.5 px-1.5 py-0.5 rounded transition-colors hover:bg-white/[0.04] border border-white/5 bg-white/[0.015]"
				style={{
					gridTemplateColumns: "4.8rem 3.8rem 4rem 4.2rem",
				}}
			>
				{/* 1. Posición y DriverTag */}
				<div className="flex items-center w-full min-w-full">
					<DriverTag
						short={rowDriver.Tla}
						teamColor={rowDriver.TeamColour}
						position={rowPos || Number(rowTiming.Position)}
						showIcon={false}
						className="scale-[0.80] origin-left"
					/>
				</div>

				{/* 2. Gap */}
				<div className="scale-[0.85] origin-left">
					<DriverGap timingDriver={rowTiming} sessionPart={sessionPart} />
				</div>

				{/* 3. Neumático */}
				<div className="scale-[0.85] origin-left">
					<DriverTire stints={rowAppTiming?.Stints} />
				</div>

				{/* 4. Tiempo de Vuelta */}
				<div className="scale-[0.85] origin-left">
					<DriverLapTime
						last={rowTiming.LastLapTime || { Value: "" }}
						best={rowTiming.BestLapTime || { Value: "" }}
						hasFastest={hasFastest}
					/>
				</div>
			</div>
		);
	};

	return (
		// Overlay
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
			onClick={onClose}
		>
			{/* Modal Container con borde fino del color de la escudería */}
			<div
				className="relative w-full max-w-sm md:max-w-xl bg-[#111827]/95 backdrop-blur-md rounded-xl overflow-hidden animate-in zoom-in-95 duration-150 shadow-2xl"
				style={{
					border: `1.5px solid ${teamColor}`,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header Estilo Broadcast con más padding */}
				<div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/10 bg-white/[0.02]">
					<div className="flex items-center gap-2.5 min-w-0">
						{/* Número de Carrera grande con el color de la escudería */}
						<span
							className="font-mono font-black text-xl sm:text-2xl tracking-tighter leading-none select-none shrink-0"
							style={{ color: teamColor }}
						>
							#{driver.RacingNumber}
						</span>

						{/* Nombre, Ganancia de puestos y Escudería */}
						<div className="flex flex-col min-w-0 justify-center">
							<div className="flex items-center gap-2 min-w-0">
								<h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate font-sans leading-none">
									{driver.FirstName} <span className="uppercase">{driver.LastName}</span>
								</h3>

								{/* Badge de Ganancia / Pérdida de Puestos */}
								{posDiff !== null && (
									<span
										className={clsx(
											"inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border leading-none shrink-0",
											posDiff > 0 && "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
											posDiff < 0 && "text-red-400 bg-red-500/15 border-red-500/30",
											posDiff === 0 && "text-gray-400 bg-white/5 border-white/10",
										)}
										title={`Largó P${gridPos} · Posición actual P${currentPos}`}
									>
										{posDiff > 0 && <ArrowUp className="w-2.5 h-2.5 shrink-0" />}
										{posDiff < 0 && <ArrowDown className="w-2.5 h-2.5 shrink-0" />}
										{posDiff > 0 ? `+${posDiff}` : posDiff < 0 ? `${posDiff}` : "="}
									</span>
								)}
							</div>

							<p className="text-[10px] sm:text-[11px] font-mono font-medium text-gray-400 uppercase tracking-wider truncate mt-1">
								{driver.TeamName}
							</p>
						</div>
					</div>

					{/* Posición & Botón Cerrar */}
					<div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
						<div className="px-2 py-0.5 bg-white/10 border border-white/15 text-white font-mono font-black rounded text-xs sm:text-sm tabular-nums tracking-wide">
							P{timingDriver.Position}
						</div>
						<button
							onClick={onClose}
							className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
							title="Cerrar detalles"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				</div>

				{/* Body - HUD Limpio y Compacto */}
				<div className="p-3.5 sm:p-4 space-y-3 sm:space-y-3.5 overflow-y-auto max-h-[80vh]">
					{/* Bloque 1: Ritmo y Neumático Actual (2 columnas) */}
					<div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 items-stretch">
						{/* 1. Tiempos de Vuelta Apilados */}
						<div className="flex flex-col justify-between min-h-[60px] pr-1">
							<div className="flex items-center justify-between mb-1">
								<span className="text-[9px] uppercase font-mono font-bold text-gray-400 tracking-wider">
									Tiempos
								</span>
								<span className="text-[8.5px] font-mono text-gray-500 font-bold">
									V{timingDriver.NumberOfLaps || cumulativeLaps}
								</span>
							</div>

							<div className="flex flex-col gap-1">
								<div className="flex items-center justify-between">
									<span className="text-[8.5px] uppercase font-mono font-semibold text-gray-400">Última</span>
									<span className="text-xs sm:text-[13px] font-mono font-bold text-emerald-400 tabular-nums">
										{timingDriver.LastLapTime?.Value || "--:--.---"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-[8.5px] uppercase font-mono font-semibold text-gray-400">Mejor</span>
									<span className="text-xs sm:text-[13px] font-mono font-bold text-violet-400 tabular-nums">
										{timingStatsDriver?.PersonalBestLapTime?.Value || "--:--.---"}
									</span>
								</div>
							</div>
						</div>

						{/* 2. Neumático Actual */}
						<div className="flex flex-col justify-between min-h-[60px] pl-2.5 sm:pl-3 border-l border-white/5">
							{/* Encabezado: Título + Estado Boxes/Pista */}
							<div className="flex items-center justify-between mb-1">
								<span className="text-[9px] uppercase font-mono font-bold text-gray-400 tracking-wider">
									Neumático
								</span>
								<span
									className={clsx(
										"text-[7.5px] sm:text-[8px] px-1.5 py-0.2 rounded font-mono font-bold uppercase border leading-none shrink-0",
										timingDriver.InPit
											? "bg-red-500/15 text-red-400 border-red-500/30"
											: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
									)}
								>
									{timingDriver.InPit ? "Boxes" : "Pista"}
								</span>
							</div>

							<div className="flex flex-col gap-1">
								{/* Fila 1: Ícono + Compuesto */}
								<div className="flex items-center gap-1.5 min-w-0">
									<TireIcon compound={tyreCompound} size={15} className="shrink-0" />
									<span className={clsx("text-xs sm:text-[13px] font-mono font-black uppercase tracking-wide truncate leading-none", getTyreColor(tyreCompound))}>
										{tyreCompound.toUpperCase().includes("INTER") ? "INTER" : tyreCompound}
									</span>
								</div>

								{/* Fila 2: NUEVO/USADO a la izquierda | Laps y Pits a la derecha */}
								<div className="flex items-center justify-between">
									<span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300 uppercase leading-none shrink-0 border border-white/10">
										{isNewTyre ? "NUEVO" : "USADO"}
									</span>

									<div className="flex items-center gap-1 text-xs sm:text-[13px] font-mono tabular-nums leading-none">
										<span className="font-bold text-white">
											{tyreLaps}<span className="text-[9px] font-normal text-gray-400 ml-0.5">L</span>
										</span>
										<span className="text-[9px] font-mono text-gray-500 font-normal">
											({pitCount} {pitCount === 1 ? "PIT" : "PITS"})
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Bloque 2: Historial de Neumáticos (Líneas de Stints a lo ancho) */}
					<div className="border-t border-white/5 pt-2.5">
						<div className="flex items-center justify-between mb-1.5">
							<div className="flex items-center gap-1 text-gray-400">
								<Disc className="w-3 h-3 text-gray-300" />
								<span className="text-[9px] uppercase font-mono font-bold tracking-wider text-gray-300">
									Historial de Neumáticos
								</span>
							</div>

							<span className="text-[9px] font-mono font-bold text-gray-400">
								{stintRanges.length} {stintRanges.length === 1 ? "STINT" : "STINTS"}
							</span>
						</div>

						{/* Líneas de Stints estilo Minisectores (sin bordes, grosor uniforme) */}
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-1.5 w-full">
								{stintRanges.length > 0 ? (
									stintRanges.map((stint, idx) => {
										const style = getCompoundStyle(stint.Compound);
										const flexValue = Math.max(stint.laps || 1, 1);

										return (
											<div
												key={`stint-bar-${idx}`}
												style={{ flex: flexValue }}
												className="flex flex-col gap-0.5 min-w-0"
											>
												{/* Texto superior: Compuesto centrado */}
												<div className="flex items-center justify-center text-[8.5px] sm:text-[9px] font-mono font-bold px-0.5 leading-none mb-0.5">
													<span className={clsx("font-bold tracking-wider truncate", style.badgeText)}>
														{style.name}
													</span>
												</div>

												{/* Línea del Stint con número de vueltas adentro (completamente redondeada) */}
												<div
													className={clsx(
														"w-full h-4 sm:h-4.5 rounded-full flex items-center justify-center font-mono font-black text-[9px] sm:text-[10px] leading-none select-none transition-all shadow-sm",
														style.bg,
														style.textColor,
													)}
													title={`Stint ${idx + 1}: ${style.name} (${stint.laps} vueltas${stint.isCurrent ? " - Actual" : ""}${stint.laps > 0 ? ` · V${stint.startLap}–${stint.endLap}` : ""})`}
												>
													<span className="truncate px-1">
														{stint.laps}L
													</span>
												</div>
											</div>
										);
									})
								) : (
									<div className="w-full h-2 rounded-full bg-zinc-800 animate-pulse" />
								)}
							</div>

							{/* Indicador inferior: Únicamente la vuelta en la que se cambió el neumático */}
							{stintRanges.length > 1 && (
								<div className="flex items-center gap-1.5 w-full text-[8.5px] sm:text-[9px] font-mono text-gray-400 px-0.5 pt-0.5">
									{stintRanges.map((stint, idx) => {
										const flexValue = Math.max(stint.laps || 1, 1);
										const isLast = idx === stintRanges.length - 1;

										return (
											<div
												key={`stint-laps-${idx}`}
												style={{ flex: flexValue }}
												className="flex items-center justify-end min-w-0"
											>
												{!isLast && (
													<span className="text-gray-400 shrink-0 font-medium">
														{stint.endLap}L
													</span>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>

					{/* Bloque 3: Batalla en Pista (Estilo Dashboard: Adelante, Actual, Detrás) */}
					<div className="border-t border-white/5 pt-2.5">
						<div className="flex items-center justify-between mb-1.5">
							<span className="text-[9px] uppercase font-mono font-bold tracking-wider text-gray-400">
								Batalla en Pista
							</span>
						</div>

						{/* Tabla con estilo exacto del Dashboard */}
						<div className="overflow-x-auto no-scrollbar">
							<div className="min-w-[300px] flex flex-col gap-0.5">
								{/* Fila 1: Piloto Adelante (si existe) */}
								{aheadDriver && aheadTiming ? (
									renderBattleRow(aheadDriver, aheadTiming, aheadAppTiming, aheadStats, aheadPos, false)
								) : (
									<div className="flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded">
										<span>🏆 LÍDER DE CARRERA</span>
									</div>
								)}

								{/* Fila 2: Piloto de la DriverCard (destacado) */}
								{renderBattleRow(driver, timingDriver, appTimingDriver, timingStatsDriver, currentPos, true)}

								{/* Fila 3: Piloto Detrás (si existe) */}
								{behindDriver && behindTiming ? (
									renderBattleRow(behindDriver, behindTiming, behindAppTiming, behindStats, behindPos, false)
								) : (
									<div className="flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono font-medium text-gray-500 bg-white/[0.02] border border-white/5 rounded">
										<span>ÚLTIMA POSICIÓN</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Bloque 4: Rendimiento por Sectores */}
					<div className="border-t border-white/5 pt-2.5">
						<p className="text-[9px] uppercase font-mono font-bold text-gray-400 mb-1.5 tracking-wider">
							Rendimiento por Sectores
						</p>
						<div className="overflow-x-auto no-scrollbar">
							<DriverMiniSectors
								sectors={timingDriver.Sectors}
								bestSectors={timingStatsDriver?.BestSectors}
								className="w-full justify-between"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DriverCardModal;
