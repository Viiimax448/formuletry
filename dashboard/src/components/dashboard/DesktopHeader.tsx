"use client";

import { useState } from "react";
import { utc, duration } from "moment";
import { Settings, Tv, AlertTriangle, ShieldAlert, Sun, CloudRain } from "lucide-react";
import { motion } from "motion/react";

import { useDataStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";
import { getWindDirection } from "@/lib/getWindDirection";

import Flag from "@/components/Flag";
import SettingsModal from "@/components/dashboard/SettingsModal";
import TvSyncModal from "@/components/dashboard/TvSyncModal";

export default function DesktopHeader() {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isTvSyncOpen, setIsTvSyncOpen] = useState(false);

	const clock = useDataStore((state) => state.state?.ExtrapolatedClock);
	const session = useDataStore((state) => state.state?.SessionInfo);
	const timingData = useDataStore((state) => state.state?.TimingData);
	const weather = useDataStore((state) => state.state?.WeatherData);
	const lapCount = useDataStore((state) => state.state?.LapCount);
	const track = useDataStore((state) => state.state?.TrackStatus);
	const delay = useSettingsStore((state) => state.delay);
	const delayIsPaused = useSettingsStore((state) => state.delayIsPaused);

	const timeRemaining =
		!!clock && !!clock.Remaining
			? clock.Extrapolating
				? utc(
						duration(clock.Remaining)
							.subtract(utc().diff(utc(clock.Utc)))
							.asMilliseconds() + (delay ? delay * 1000 : 0),
					).format("HH:mm:ss")
				: clock.Remaining
			: undefined;

	const statusCode = track?.Status ? parseInt(track.Status) : undefined;
	const currentTrackStatus = getTrackStatusMessage(statusCode);

	const isYellowFlag = statusCode === 2 || statusCode === 3 || statusCode === 6 || statusCode === 7;
	const isSafetyCar = statusCode === 4;
	const isRedFlag = statusCode === 5;
	const isWarning = isYellowFlag || isSafetyCar || isRedFlag;

	const trackTemp = weather ? Math.round(parseFloat(weather.TrackTemp)) : null;
	const airTemp = weather ? Math.round(parseFloat(weather.AirTemp)) : null;
	const humidity = weather ? parseFloat(weather.Humidity) : null;
	const windSpeed = weather ? parseFloat(weather.WindSpeed) : null;
	const windDegrees = weather?.WindDirection ? parseFloat(weather.WindDirection) : 0;
	const windCardinal = !isNaN(windDegrees) ? getWindDirection(windDegrees) : "";
	const isRaining = weather?.Rainfall === "1";

	const currentLap = lapCount?.CurrentLap ? Number(lapCount.CurrentLap) : 0;
	const totalLaps = lapCount?.TotalLaps ? Number(lapCount.TotalLaps) : 0;
	const lapProgress = totalLaps > 0 ? Math.min(100, Math.max(0, (currentLap / totalLaps) * 100)) : 0;

	return (
		<div className="hidden w-full items-center justify-between overflow-hidden rounded-lg bg-[#151D2C] border border-gray-800/90 px-4 py-2.5 shadow-md md:flex gap-4">
			{/* Izquierda: Bandera + GP Name + Sesión & Reloj */}
			<div className="flex items-center gap-3 shrink-0 min-w-0">
				<Flag
					countryCode={session?.Meeting.Country.Code}
					className="h-7 w-11 rounded-md object-cover border border-white/10 shrink-0"
				/>
				<div className="flex flex-col justify-center min-w-0">
					<h1 className="truncate text-xs font-bold text-white tracking-tight leading-tight">
						{session?.Meeting.Name ?? "Formula 1 Grand Prix"}
					</h1>
					<div className="flex items-center gap-1.5 mt-0.5 text-xs text-white/50">
						<span className="font-medium text-white/70">
							{session?.Name ?? "Carrera"}
							{timingData?.SessionPart ? ` ${timingData.SessionPart}` : ""}
						</span>
						<span className="text-white/20">•</span>
						<span className="font-mono text-white/90 font-medium tabular-nums">
							{timeRemaining ?? "--:--:--"}
						</span>
					</div>
				</div>
			</div>

			{/* Centro: Strip de Telemetría Climática con Brújula Dinámica */}
			<div className="hidden lg:flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-md px-3 py-1.5 text-xs whitespace-nowrap text-white/70">
				{/* Pista */}
				<div className="flex items-center gap-1">
					<span className="text-[10px] uppercase font-medium text-white/40">Pista</span>
					<span className="font-mono font-medium text-white tabular-nums">
						{trackTemp !== null ? `${trackTemp}°` : "--"}
					</span>
				</div>

				<span className="text-white/15">•</span>

				{/* Aire */}
				<div className="flex items-center gap-1">
					<span className="text-[10px] uppercase font-medium text-white/40">Aire</span>
					<span className="font-mono font-medium text-white tabular-nums">
						{airTemp !== null ? `${airTemp}°` : "--"}
					</span>
				</div>

				<span className="text-white/15">•</span>

				{/* Humedad */}
				<div className="flex items-center gap-1">
					<span className="text-[10px] uppercase font-medium text-white/40">Hum</span>
					<span className="font-mono font-medium text-white tabular-nums">
						{humidity !== null ? `${humidity}%` : "--"}
					</span>
				</div>

				<span className="text-white/15">•</span>

				{/* Viento Dinámico */}
				<div
					className="flex items-center gap-1"
					title={`Viento: ${windSpeed ?? "--"} m/s (${Math.round(windDegrees)}° ${windCardinal})`}
				>
					<svg
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="text-white/50 transition-transform duration-500 ease-out shrink-0"
						style={{ transform: `rotate(${windDegrees}deg)` }}
					>
						<path d="M12 2L19 21L12 17L5 21L12 2Z" fill="currentColor" />
					</svg>
					<span className="font-mono font-medium text-white tabular-nums">
						{windSpeed !== null ? `${windSpeed}m/s` : "--"}
					</span>
					{windCardinal && (
						<span className="text-[9.5px] font-mono text-white/40 uppercase">
							{windCardinal}
						</span>
					)}
				</div>

				<span className="text-white/15">•</span>

				{/* Estado de Cielo */}
				<div className="flex items-center gap-1 text-white/60">
					{isRaining ? (
						<>
							<CloudRain className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
							<span className="text-cyan-300 font-medium text-[11px]">Lluvia</span>
						</>
					) : (
						<>
							<Sun className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
							<span className="text-white/70 font-medium text-[11px]">Despejado</span>
						</>
					)}
				</div>
			</div>

			{/* Derecha: Track Status + Vueltas con Barra + Cápsula Unificada */}
			<div className="flex items-center gap-3 shrink-0">
				{/* Track Status */}
				{isWarning ? (
					<div
						className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase transition-all border ${
							isRedFlag
								? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
								: "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
						}`}
					>
						{isRedFlag ? (
							<ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
						) : (
							<AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
						)}
						<span>{currentTrackStatus?.message ?? "FLAG"}</span>
					</div>
				) : (
					<div className="inline-flex items-center gap-1.5 font-mono font-medium text-emerald-400 text-xs">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
						<span>Track Clear</span>
					</div>
				)}

				<span className="text-white/15">|</span>

				{/* Vueltas con Mini Barra de Progreso Integrada (ocupa todo el ancho del bloque) */}
				<div className="flex flex-col">
					<div className="flex items-baseline gap-1.5">
						<span className="text-[9.5px] font-bold text-white/40 uppercase tracking-wider">
							VUELTAS
						</span>
						<div className="flex items-baseline gap-1 font-mono leading-none">
							<span className="text-sm font-bold text-white tabular-nums">
								{currentLap}
							</span>
							<span className="text-[10.5px] font-medium text-white/40 tabular-nums">
								/ {totalLaps}
							</span>
						</div>
					</div>
					{totalLaps > 0 && (
						<div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden mt-1">
							<div
								className="h-full bg-gradient-to-r from-red-600 to-[#FF453A] rounded-full transition-all duration-700 ease-out"
								style={{ width: `${lapProgress}%` }}
							/>
						</div>
					)}
				</div>

				<span className="text-white/15">|</span>

				{/* Cápsula Unificada Segmentada (TV Sync + Ajustes) */}
				<div className="inline-flex items-center rounded-md bg-white/[0.04] border border-white/[0.08] divide-x divide-white/[0.08] shadow-xs">
					{/* Botón TV Sync */}
					<motion.button
						whileTap={{ scale: 0.96 }}
						onClick={() => setIsTvSyncOpen(true)}
						className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium transition-colors hover:bg-white/[0.06] ${
							delayIsPaused
								? "text-amber-300 animate-pulse"
								: delay > 0
									? "text-cyan-300"
									: "text-white/70 hover:text-white"
						}`}
						title="Sincronizar telemetría con tu TV"
					>
						{delayIsPaused ? (
							<>
								<span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
								<span>PAUSA ({delay}s)</span>
							</>
						) : delay > 0 ? (
							<>
								<Tv className="w-3 h-3 text-cyan-400/90" />
								<span>TV -{delay}s</span>
							</>
						) : (
							<>
								<span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
								<span>TV SYNC</span>
							</>
						)}
					</motion.button>

					{/* Botón Ajustes integrado */}
					<motion.button
						whileTap={{ scale: 0.94 }}
						onClick={() => setIsSettingsOpen(true)}
						className="px-2 py-1 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
						title="Configuración"
					>
						<Settings className="w-3.5 h-3.5" />
					</motion.button>
				</div>
			</div>

			{/* Modal de Sincronización TV */}
			<TvSyncModal isOpen={isTvSyncOpen} onClose={() => setIsTvSyncOpen(false)} />

			{/* Modal de Configuración General */}
			<SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
		</div>
	);
}
