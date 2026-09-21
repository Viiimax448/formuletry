"use client";

import { useState } from "react";
import { utc, duration } from "moment";
import { Settings } from "lucide-react";
import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";
import { getWindDirection } from "@/lib/getWindDirection";

import Flag from "@/components/Flag";
import SettingsModal from "@/components/dashboard/SettingsModal";

// Icons matching MobileHeader & WeatherInfo
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

export default function DesktopHeader() {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const clock = useDataStore((state) => state.state?.ExtrapolatedClock);
	const session = useDataStore((state) => state.state?.SessionInfo);
	const timingData = useDataStore((state) => state.state?.TimingData);
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
	const windDirection = weather?.WindDirection ? getWindDirection(parseInt(weather.WindDirection)) : "";
	const isRaining = weather?.Rainfall === "1";

	return (
		<div className="hidden w-full items-center justify-between overflow-hidden rounded-lg bg-[#111827] border border-gray-600/30 px-4 py-2.5 shadow-lg md:flex gap-4">
			{/* Left: Country Flag + Meeting Name + Session & Clock */}
			<div className="flex items-center gap-3 shrink-0 min-w-0">
				<Flag
					countryCode={session?.Meeting.Country.Code}
					className="h-8 w-12 rounded shadow-sm border border-neutral-700/50 shrink-0"
				/>
				<div className="flex flex-col justify-center min-w-0">
					<h1 className="truncate text-xs font-semibold text-gray-200">
						{session?.Meeting.Name ?? "Formula 1 Grand Prix"}
					</h1>
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium text-gray-400">
							{session?.Name ?? "Session"}
							{timingData?.SessionPart ? ` ${timingData.SessionPart}` : ""}
						</span>
						<span className="text-gray-600">•</span>
						<span className="font-mono text-base font-black text-white">
							{timeRemaining ?? "--:--:--"}
						</span>
					</div>
				</div>
			</div>

			{/* Center: Weather Telemetry Strip (Matching Mobile single-line design) */}
			<div className="hidden lg:flex items-center gap-2.5 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs whitespace-nowrap">
				{/* Track Temp */}
				<div className="flex items-center gap-1.5">
					<TrackTempIcon />
					<span className="text-gray-400 font-medium">Pista</span>
					<span className="font-mono font-semibold text-white">{trackTemp !== null ? `${trackTemp}°C` : "--"}</span>
				</div>

				<span className="text-gray-700">•</span>

				{/* Air Temp */}
				<div className="flex items-center gap-1.5">
					<AirTempIcon />
					<span className="text-gray-400 font-medium">Aire</span>
					<span className="font-mono font-semibold text-white">{airTemp !== null ? `${airTemp}°C` : "--"}</span>
				</div>

				<span className="text-gray-700">•</span>

				{/* Humidity */}
				<div className="flex items-center gap-1.5">
					<HumidityIcon />
					<span className="text-gray-400 font-medium">Hum</span>
					<span className="font-mono font-semibold text-white">{humidity !== null ? `${humidity}%` : "--"}</span>
				</div>

				<span className="text-gray-700">•</span>

				{/* Wind */}
				<div className="flex items-center gap-1.5">
					<WindIcon />
					<span className="text-gray-400 font-medium">Viento</span>
					<span className="font-mono font-semibold text-white">
						{windSpeed !== null ? `${windDirection} ${windSpeed}m/s` : "--"}
					</span>
				</div>

				<span className="text-gray-700">•</span>

				{/* Rain / Clear Status */}
				<div className="flex items-center gap-1.5">
					{isRaining ? <RainIcon /> : <ClearIcon />}
					<span className="font-medium text-gray-300">{isRaining ? "Lluvia" : "Despejado"}</span>
				</div>

				{/* Settings Button */}
				<button
					onClick={() => setIsSettingsOpen(true)}
					className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white ml-0.5"
					title="Ajustes"
				>
					<Settings className="w-3.5 h-3.5" />
				</button>
			</div>

			{/* Right: Track Status & Lap Counter */}
			<div className="flex items-center gap-4 shrink-0">
				{/* Track Status */}
				<div className="flex items-center gap-2">
					<div
						className="w-2.5 h-2.5 rounded-full"
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

				<span className="text-gray-700">|</span>

				{/* Lap Counter */}
				<div className="flex flex-col items-end">
					<span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">VUELTAS</span>
					<span className="font-mono text-base font-black text-white leading-tight">
						{lapCount?.CurrentLap ?? 0} <span className="text-xs text-gray-400 font-medium">/ {lapCount?.TotalLaps ?? 0}</span>
					</span>
				</div>
			</div>

			{isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
		</div>
	);
}
