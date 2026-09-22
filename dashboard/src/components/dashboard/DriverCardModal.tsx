import React from "react";
import { X, Disc, ArrowUp, ArrowDown } from "lucide-react";
import clsx from "clsx";
import { useDataStore } from "@/stores/useDataStore";
import DriverMiniSectors from "../driver/DriverMiniSectors";
import { sortPos } from "@/lib/sorting";
import { getCustomTeamColor, getContrastColor } from "@/lib/teamColors";
import type { Driver, TimingDataDriver } from "@/types/state.type";

interface DriverCardModalProps {
	driver: Driver;
	timingDriver: TimingDataDriver;
	onClose: () => void;
}

const DriverCardModal: React.FC<DriverCardModalProps> = ({ driver, timingDriver, onClose }) => {
	// 1. Regla de oro: Convertir número a string
	const driverNumStr = String(driver.RacingNumber);

	// 2. Extraer datos del store
	const timingStatsDriver = useDataStore((state) => state.state?.TimingStats?.Lines[driverNumStr]);
	const appTimingDriver = useDataStore((state) => state.state?.TimingAppData?.Lines[driverNumStr]);
	const allDrivers = useDataStore((state) => state.state?.DriverList);
	const allTiming = useDataStore((state) => state.state?.TimingData?.Lines);
	const sessionPart = useDataStore((state) => state.state?.TimingData?.SessionPart);

	const teamColor = getCustomTeamColor(driver.TeamColour, driver.Tla);
	const textColor = getContrastColor(teamColor);
	const isDarkText = textColor === "#090d16";
	const outerBorder = isDarkText ? "border-black/20" : "border-white/20";

	// 3. Calcular neumático
	const lastStint = appTimingDriver?.Stints?.[appTimingDriver.Stints.length - 1];
	const tyreCompound = lastStint?.Compound || "N/A";
	const isNewTyre = lastStint?.New === "true";
	const tyreLaps = lastStint?.TotalLaps || 0;

	// Helper para el color de los neumáticos
	const getTyreColor = (compound: string) => {
		const c = compound.toUpperCase();
		if (c.includes("SOFT")) return "text-red-500";
		if (c.includes("MEDIUM")) return "text-yellow-400";
		if (c.includes("HARD")) return "text-white";
		if (c.includes("INTER") || c.includes("INTERMEDIATE")) return "text-emerald-400";
		if (c.includes("WET")) return "text-blue-400";
		return "text-white";
	};

	// 4. Lógica de Gaps con función helper
	const getGapToFront = (line: any) => {
		if (!line) return "--";
		const gap =
			line.IntervalToPositionAhead?.Value ??
			(line.Stats ? line.Stats[sessionPart ? sessionPart - 1 : 0]?.TimeDifftoPositionAhead : undefined) ??
			line.TimeDiffToPositionAhead ??
			"";
		return gap ? gap : "--";
	};

	// 5. Calcular pilotos adelante y atrás
	let driverAhead: Driver | null = null;
	let driverBehind: Driver | null = null;
	let gapAhead = "--";
	let gapBehind = "--";

	if (allTiming && allDrivers) {
		const sortedLines = Object.values(allTiming).sort(sortPos);
		const myIndex = sortedLines.findIndex((l) => String(l.RacingNumber) === driverNumStr);

		// Piloto adelante
		if (myIndex > 0) {
			const aheadLine = sortedLines[myIndex - 1];
			driverAhead = allDrivers[aheadLine.RacingNumber];
			gapAhead = getGapToFront(timingDriver);
		} else if (myIndex === 0) {
			gapAhead = "LÍDER";
		}

		// Piloto atrás
		if (myIndex < sortedLines.length - 1) {
			const behindLine = sortedLines[myIndex + 1];
			driverBehind = allDrivers[behindLine.RacingNumber];
			gapBehind = getGapToFront(behindLine);
		}
	}

	return (
		// Overlay
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
			onClick={onClose}
		>
			{/* Modal Container */}
			<div
				className="relative w-full max-w-sm md:max-w-2xl bg-[#111827] border border-white/10 rounded-xl overflow-hidden animate-in zoom-in-95 duration-150"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Detalle Escudería (barra lateral fina de 3px) */}
				<div
					className="absolute w-[3px] top-0 bottom-0 left-0"
					style={{ backgroundColor: teamColor }}
				/>

				{/* Header Estilo Broadcast */}
				<div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 pl-5 sm:pl-7 border-b border-white/10 bg-white/[0.02]">
					<div className="flex items-center gap-3 min-w-0">
						{/* Bloque de Piloto Oficial F1 */}
						<div
							className={clsx(
								"flex flex-col items-stretch justify-center rounded-md overflow-hidden border min-w-[36px] w-[36px] select-none py-0.5 shrink-0",
								outerBorder,
							)}
							style={{ backgroundColor: teamColor, color: textColor }}
							title={`${driver.BroadcastName} (#${driver.RacingNumber})`}
						>
							<div className="flex items-center justify-center px-0.5 leading-none font-mono font-black text-xs tabular-nums">
								{driver.RacingNumber}
							</div>
							<div className="flex items-center justify-center px-0.5 pt-0.5">
								<span className="font-mono text-[9.5px] font-bold tracking-wider leading-none opacity-90">
									{driver.Tla}
								</span>
							</div>
						</div>

						{/* Nombre y Escudería */}
						<div className="flex flex-col min-w-0">
							<h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate font-sans">
								{driver.FirstName} <span className="uppercase">{driver.LastName}</span>
							</h3>
							<p className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider truncate">
								{driver.TeamName}
							</p>
						</div>
					</div>

					{/* Posición & Botón Cerrar */}
					<div className="flex items-center gap-2 sm:gap-3 shrink-0">
						<div className="px-2.5 py-1 bg-white/10 border border-white/15 text-white font-mono font-black rounded-md text-base sm:text-lg tabular-nums tracking-wide">
							P{timingDriver.Position}
						</div>
						<button
							onClick={onClose}
							className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
							title="Cerrar detalles"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Body - Bento Layout */}
				<div className="p-3.5 sm:p-5 space-y-2.5 sm:space-y-3 overflow-y-auto max-h-[80vh]">
					{/* Fila 1: Grid 3 columnas - Neumáticos | Tiempos | Pits */}
					<div className="grid grid-cols-3 gap-2 sm:gap-2.5">
						{/* 1. Neumáticos */}
						<div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[105px]">
							<div className="flex items-center gap-1.5 text-gray-400">
								<Disc className="w-3.5 h-3.5" />
								<span className="text-[10px] uppercase font-mono font-bold">Neumático</span>
							</div>

							<p className={clsx("text-base sm:text-lg font-mono font-black uppercase tracking-wide my-1", getTyreColor(tyreCompound))}>
								{tyreCompound}
							</p>

							<div className="flex items-center justify-center gap-1.5 w-full">
								<span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-gray-300 uppercase">
									{isNewTyre ? "NUEVO" : "USADO"}
								</span>
								<span className="text-[11px] text-gray-400 font-mono font-bold">
									{tyreLaps}L
								</span>
							</div>
						</div>

						{/* 2. Tiempos (Última / Mejor) */}
						<div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 flex flex-col justify-between text-center min-h-[105px]">
							<div>
								<p className="text-[10px] uppercase font-mono font-bold text-gray-400 mb-0.5">Última</p>
								<p className="text-xs sm:text-sm md:text-base font-mono font-bold text-emerald-400 tabular-nums">
									{timingDriver.LastLapTime?.Value || "--:--.---"}
								</p>
							</div>

							<div className="border-t border-white/5 pt-1.5">
								<p className="text-[10px] uppercase font-mono font-bold text-gray-400 mb-0.5">Mejor</p>
								<p className="text-xs sm:text-sm md:text-base font-mono font-bold text-violet-400 tabular-nums">
									{timingStatsDriver?.PersonalBestLapTime?.Value || "--:--.---"}
								</p>
							</div>
						</div>

						{/* 3. Pits */}
						<div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 flex flex-col items-center justify-between text-center min-h-[105px]">
							<span className="text-[10px] uppercase font-mono font-bold text-gray-400">Pits</span>

							<p className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums my-0.5">
								{appTimingDriver?.Stints ? appTimingDriver.Stints.length - 1 : 0}
							</p>

							<span
								className={clsx(
									"text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase inline-block border",
									timingDriver.InPit
										? "bg-red-500/15 text-red-400 border-red-500/30"
										: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
								)}
							>
								{timingDriver.InPit ? "En Boxes" : "En Pista"}
							</span>
						</div>
					</div>

					{/* Fila 2: Gaps Adelante y Atrás (2 columnas) */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
						{/* Adelante */}
						<div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 sm:p-3.5 flex flex-col justify-between min-h-[75px]">
							<div className="flex items-center gap-1.5 mb-1.5">
								<ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
								<span className="text-[10px] uppercase font-mono font-bold text-gray-400">Adelante</span>
							</div>

							{gapAhead === "LÍDER" ? (
								<div className="flex items-center justify-between">
									<span className="text-lg sm:text-xl font-mono font-black text-amber-400">LÍDER</span>
									<span className="text-xs font-mono text-gray-400">P1 EN CARRERA</span>
								</div>
							) : (
								<div className="flex items-center justify-between">
									<span className="text-lg sm:text-xl font-mono font-black text-white">
										{driverAhead ? driverAhead.Tla : "---"}
									</span>
									<span className="text-lg sm:text-xl font-mono font-bold tabular-nums text-emerald-400">
										{gapAhead}
									</span>
								</div>
							)}
						</div>

						{/* Atrás */}
						<div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 sm:p-3.5 flex flex-col justify-between min-h-[75px]">
							<div className="flex items-center gap-1.5 mb-1.5">
								<ArrowDown className="w-3.5 h-3.5 text-red-400" />
								<span className="text-[10px] uppercase font-mono font-bold text-gray-400">Atrás</span>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-lg sm:text-xl font-mono font-black text-white">
									{driverBehind ? driverBehind.Tla : "---"}
								</span>
								<span className="text-lg sm:text-xl font-mono font-bold tabular-nums text-red-400">
									{gapBehind}
								</span>
							</div>
						</div>
					</div>

					{/* Fila 3: Minisectores (Rendimiento por sectores) */}
					<div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 sm:p-3.5">
						<p className="text-[10px] uppercase font-mono font-bold text-gray-400 mb-2.5 tracking-wider">
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
