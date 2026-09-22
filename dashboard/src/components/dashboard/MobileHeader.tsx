"use client";

import { useState, useEffect } from "react";
import { utc, duration } from "moment";
import { Settings } from "lucide-react";

import { useDataStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";
import { getWindDirection } from "@/lib/getWindDirection";

import Flag from "@/components/Flag";
import SettingsModal from "@/components/dashboard/SettingsModal";

// Icons matching WeatherInfo
const TrackTempIcon = () => (
	<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
		<path d="M8 2L14 8L8 14L2 8L8 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
	</svg>
);

const AirTempIcon = () => (
	<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
		<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
		<path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

const HumidityIcon = () => (
	<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
		<path d="M8 2C6 4 4 6 4 9C4 11.2 5.8 13 8 13C10.2 13 12 11.2 12 9C12 6 10 4 8 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
	</svg>
);

const WindIcon = () => (
	<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
		<path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const RainIcon = () => (
	<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
		<path d="M4 6C4 4.5 5 3 6.5 3C7.5 3 8.5 3.5 9 4.5C9.5 3.5 10.5 3 11.5 3C13 3 14 4.5 14 6C14 7 13.5 8 12.5 8H5.5C4.5 8 4 7 4 6Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
		<path d="M6 10L6.5 12M8 10L8.5 12M10 10L10.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
);

const ClearIcon = () => (
	<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-400">
		<circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
		<path d="M8 1v2M8 13v2M15 8h-2M3 8H1M13.3 2.7l-1.4 1.4M4.1 11.9l-1.4 1.4M13.3 13.3l-1.4-1.4M4.1 4.1L2.7 2.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
);

export default function MobileHeader() {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 30);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const clock = useDataStore((state) => state.state?.ExtrapolatedClock);
	const session = useDataStore((state) => state.state?.SessionInfo);
	const weather = useDataStore((state) => state.state?.WeatherData);
	const lapCount = useDataStore((state) => state.state?.LapCount);
	const track = useDataStore((state) => state.state?.TrackStatus);
	const delay = useSettingsStore((state) => state.delay);

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

	const currentTrackStatus = getTrackStatusMessage(track?.Status ? parseInt(track?.Status) : undefined);

	const getDotColor = (statusCode: number | undefined) => {
		switch (statusCode) {
			case 1:
				return "#10B981";
			case 2:
			case 3:
			case 4:
			case 6:
			case 7:
				return "#F59E0B";
			case 5:
				return "#EF4444";
			default:
				return "#10B981";
		}
	};

	const trackColor = getDotColor(track?.Status ? parseInt(track?.Status) : undefined);
	const trackTemp = weather ? Math.round(parseFloat(weather.TrackTemp)) : null;
	const airTemp = weather ? Math.round(parseFloat(weather.AirTemp)) : null;
	const humidity = weather ? parseFloat(weather.Humidity) : null;
	const windSpeed = weather ? parseFloat(weather.WindSpeed) : null;
	const isRaining = weather?.Rainfall === "1";

	// Vista compactada sticky al hacer scroll
	if (isScrolled) {
		return (
			<div className="sticky top-0 z-40 flex w-full items-center justify-between rounded-lg bg-[#111827]/95 backdrop-blur-md border border-white/10 px-3 py-2 md:hidden transition-all duration-200">
				{/* Izquierda: Contador de Vueltas & Reloj */}
				<div className="flex items-center gap-2 min-w-0">
					<div className="flex items-baseline gap-1.5">
						<span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">VUELTAS</span>
						<span className="font-mono text-sm font-black text-white tabular-nums leading-none">
							{lapCount?.CurrentLap ?? 0}
							<span className="text-[11px] text-gray-400 font-medium ml-0.5">/{lapCount?.TotalLaps ?? 0}</span>
						</span>
					</div>
					<span className="text-gray-700">•</span>
					<span className="font-mono text-xs font-bold text-white tabular-nums">
						{timeRemaining ?? "--:--:--"}
					</span>
				</div>

				{/* Derecha: Estado de Pista & Ajustes */}
				<div className="flex items-center gap-2 shrink-0">
					<div className="flex items-center gap-1.5">
						<div
							className="w-2 h-2 rounded-full"
							style={{
								backgroundColor: trackColor,
								boxShadow: `0 0 6px ${trackColor}60`,
							}}
						/>
						<span
							className="text-[11px] font-bold font-mono uppercase tracking-wide truncate max-w-[130px]"
							style={{ color: trackColor }}
						>
							{currentTrackStatus?.message ?? "ALL CLEAR"}
						</span>
					</div>

					<button
						onClick={() => setIsSettingsOpen(true)}
						className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
						title="Ajustes"
					>
						<Settings className="w-3.5 h-3.5" />
					</button>
				</div>

				{isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
			</div>
		);
	}

	return (
		<div className="sticky top-0 z-40 flex w-full flex-col gap-2.5 pt-2 pb-2 px-1 bg-[#111827] border-b border-white/5 md:hidden">
			{/* Fila 1: Sesión + Reloj (Izquierda) & Vueltas (Derecha) */}
			<div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-1.5">
				<div className="flex items-center gap-2.5 min-w-0">
					<Flag
						countryCode={session?.Meeting.Country.Code}
						className="h-7 w-11 rounded border border-neutral-700/50 shrink-0"
					/>
					<div className="flex flex-col justify-center min-w-0">
						<h1 className="truncate text-xs font-semibold text-gray-200">
							{session?.Meeting.Name ?? "F1 Grand Prix"}
						</h1>
						<div className="flex items-center gap-1.5">
							<span className="text-[11px] font-medium text-gray-400">
								{session?.Name ?? "Race"}
							</span>
							<span className="text-gray-600">•</span>
							<span className="font-mono text-xs font-extrabold text-white">
								{timeRemaining ?? "--:--:--"}
							</span>
						</div>
					</div>
				</div>

				{/* Contador de vueltas */}
				<div className="flex flex-col items-end shrink-0 pl-2">
					<span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">VUELTAS</span>
					<span className="font-mono text-lg font-black text-white leading-tight">
						{lapCount?.CurrentLap ?? 0} <span className="text-xs text-gray-400 font-medium">/ {lapCount?.TotalLaps ?? 0}</span>
					</span>
				</div>
			</div>

			{/* Fila 2: Clima en Fila Única Inline */}
			<div className="flex items-center justify-between gap-1 overflow-x-auto bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1 text-xs whitespace-nowrap">
				<div className="flex items-center gap-1">
					<TrackTempIcon />
					<span className="text-gray-400">Pista</span>
					<span className="font-mono font-semibold text-white">{trackTemp !== null ? `${trackTemp}°C` : "--"}</span>
				</div>

				<span className="text-gray-700">•</span>

				<div className="flex items-center gap-1">
					<AirTempIcon />
					<span className="text-gray-400">Aire</span>
					<span className="font-mono font-semibold text-white">{airTemp !== null ? `${airTemp}°C` : "--"}</span>
				</div>

				<span className="text-gray-700">•</span>

				<div className="flex items-center gap-1">
					<HumidityIcon />
					<span className="text-gray-400">Hum</span>
					<span className="font-mono font-semibold text-white">{humidity !== null ? `${humidity}%` : "--"}</span>
				</div>

				<span className="text-gray-700">•</span>

				<div className="flex items-center gap-1">
					<WindIcon />
					<span className="font-mono font-semibold text-white">{windSpeed !== null ? `${windSpeed}m/s` : "--"}</span>
				</div>
			</div>

			{/* Fila 3: Estado de Pista (Izquierda) & Clima / Ajustes (Derecha) */}
			<div className="flex items-center justify-between pt-0.5">
				{/* Estado de pista */}
				<div className="flex items-center gap-2">
					<div
						className="w-2.5 h-2.5 rounded-full animate-pulse-dot"
						style={{
							backgroundColor: trackColor,
							boxShadow: `0 0 8px ${trackColor}60`,
						}}
					/>
					<span
						className="text-xs font-bold font-mono uppercase tracking-wide"
						style={{ color: trackColor }}
					>
						{currentTrackStatus?.message ?? "ALL CLEAR"}
					</span>
				</div>

				{/* Estado de lluvia/despejado + Ajustes */}
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1 text-xs text-gray-300">
						{isRaining ? <RainIcon /> : <ClearIcon />}
						<span className="font-medium text-[11px]">{isRaining ? "Lluvia" : "Despejado"}</span>
					</div>

					<button
						onClick={() => setIsSettingsOpen(true)}
						className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
						title="Ajustes"
					>
						<Settings className="w-4 h-4" />
					</button>
				</div>
			</div>

			{isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
		</div>
	);
}
