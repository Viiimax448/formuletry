import React from "react";
import { X, Disc, ArrowUp, ArrowDown } from "lucide-react";
import clsx from "clsx";
import { useDataStore } from "@/stores/useDataStore";
import DriverMiniSectors from "../driver/DriverMiniSectors";
import DriverTag from "../driver/DriverTag";
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
				name: "SOFT",
			};
		}
		if (c.includes("MEDIUM")) {
			return {
				bg: "bg-yellow-400",
				badgeText: "text-yellow-400",
				name: "MEDIUM",
			};
		}
		if (c.includes("HARD")) {
			return {
				bg: "bg-white",
				badgeText: "text-white",
				name: "HARD",
			};
		}
		if (c.includes("INTER") || c.includes("INTERMEDIATE")) {
			return {
				bg: "bg-emerald-500",
				badgeText: "text-emerald-400",
				name: "INTER",
			};
		}
		if (c.includes("WET")) {
			return {
				bg: "bg-blue-500",
				badgeText: "text-blue-400",
				name: "WET",
			};
		}
		return {
			bg: "bg-gray-600",
			badgeText: "text-gray-400",
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

	// 5. Lógica de Gaps
	const getGapToFront = (line: any) => {
		if (!line) return "--";
		const gap =
			line.IntervalToPositionAhead?.Value ??
			(line.Stats ? line.Stats[sessionPart ? sessionPart - 1 : 0]?.TimeDifftoPositionAhead : undefined) ??
			line.TimeDiffToPositionAhead ??
			"";
		return gap ? gap : "--";
	};

	// 6. Pilotos adelante y atrás
	let driverAhead: Driver | null = null;
	let driverBehind: Driver | null = null;
	let aheadPos: number | undefined = undefined;
	let behindPos: number | undefined = undefined;
	let gapAhead = "--";
	let gapBehind = "--";

	if (allTiming && allDrivers) {
		const sortedLines = Object.values(allTiming).sort(sortPos);
		const myIndex = sortedLines.findIndex((l) => String(l.RacingNumber) === driverNumStr);

		if (myIndex > 0) {
			const aheadLine = sortedLines[myIndex - 1];
			driverAhead = allDrivers[aheadLine.RacingNumber];
			aheadPos = Number(aheadLine.Position) || myIndex;
			gapAhead = getGapToFront(timingDriver);
		} else if (myIndex === 0) {
			gapAhead = "LÍDER";
		}

		if (myIndex < sortedLines.length - 1) {
			const behindLine = sortedLines[myIndex + 1];
			driverBehind = allDrivers[behindLine.RacingNumber];
			behindPos = Number(behindLine.Position) || myIndex + 2;
			gapBehind = getGapToFront(behindLine);
		}
	}

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
												{/* Texto superior: Compuesto y Vueltas */}
												<div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-mono font-semibold px-0.5 leading-none">
													<span className={clsx("font-bold tracking-wider", style.badgeText)}>
														{style.name}
													</span>
													<span className="tabular-nums text-gray-400 text-[8px] sm:text-[8.5px]">
														{stint.laps}L {stint.laps > 0 ? `(V${stint.startLap}–${stint.endLap})` : ""}
													</span>
												</div>

												{/* Línea del Stint */}
												<div
													className={clsx(
														"w-full h-2 sm:h-2.5 rounded-full transition-all relative",
														style.bg,
													)}
													title={`Stint ${idx + 1}: ${style.name} (${stint.laps} vueltas${stint.isCurrent ? " - Actual" : ""})`}
												/>
											</div>
										);
									})
								) : (
									<div className="w-full h-2 rounded-full bg-zinc-800 animate-pulse" />
								)}
							</div>

							{/* Indicador inferior de progresión */}
							<div className="flex items-center justify-between text-[8.5px] font-mono text-gray-400 px-0.5 pt-0.5">
								<span>Inicio</span>
								<span>
									Vuelta actual: <strong className="text-white font-mono font-bold">{cumulativeLaps}</strong>
								</span>
							</div>
						</div>
					</div>

					{/* Bloque 3: Batalla en Pista (Adelante / Atrás con DriverTags del dashboard) */}
					<div className="border-t border-white/5 pt-2.5">
						<div className="flex items-center justify-between mb-1.5">
							<span className="text-[9px] uppercase font-mono font-bold tracking-wider text-gray-400">
								Batalla en Pista
							</span>
						</div>

						<div className="grid grid-cols-2 gap-2 sm:gap-3 items-center">
							{/* Adelante */}
							<div className="flex items-center justify-between min-w-0 pr-1 sm:pr-2">
								<div className="flex items-center gap-1.5 min-w-0">
									<ArrowUp className="w-3 h-3 text-emerald-400 shrink-0" />
									{driverAhead ? (
										<DriverTag
											position={aheadPos}
											teamColor={driverAhead.TeamColour}
											short={driverAhead.Tla}
											showIcon={false}
											className="scale-85 origin-left"
										/>
									) : (
										<span className="text-xs font-mono font-bold text-amber-400">LÍDER</span>
									)}
								</div>

								<span className={clsx("text-xs sm:text-[13px] font-mono font-bold tabular-nums shrink-0", gapAhead === "LÍDER" ? "text-amber-400 text-xs" : "text-emerald-400")}>
									{gapAhead}
								</span>
							</div>

							{/* Atrás */}
							<div className="flex items-center justify-between min-w-0 pl-2 sm:pl-3 border-l border-white/5">
								<div className="flex items-center gap-1.5 min-w-0">
									<ArrowDown className="w-3 h-3 text-red-400 shrink-0" />
									{driverBehind ? (
										<DriverTag
											position={behindPos}
											teamColor={driverBehind.TeamColour}
											short={driverBehind.Tla}
											showIcon={false}
											className="scale-85 origin-left"
										/>
									) : (
										<span className="text-xs font-mono text-gray-500">ÚLTIMO</span>
									)}
								</div>

								<span className="text-xs sm:text-[13px] font-mono font-bold tabular-nums text-red-400 shrink-0">
									{gapBehind}
								</span>
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
