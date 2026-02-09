import { useDataStore } from "@/stores/useDataStore";
import { getWindDirection } from "@/lib/getWindDirection";

// Simple SVG Icons as inline components
const TrackTempIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M8 2L14 8L8 14L2 8L8 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
	</svg>
);

const AirTempIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
		<path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5"/>
	</svg>
);

const HumidityIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M8 2C6 4 4 6 4 9C4 11.2 5.8 13 8 13C10.2 13 12 11.2 12 9C12 6 10 4 8 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
	</svg>
);

const WindIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

const RainIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M4 6C4 4.5 5 3 6.5 3C7.5 3 8.5 3.5 9 4.5C9.5 3.5 10.5 3 11.5 3C13 3 14 4.5 14 6C14 7 13.5 8 12.5 8H5.5C4.5 8 4 7 4 6Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
		<path d="M6 10L6.5 12M8 10L8.5 12M10 10L10.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
	</svg>
);

const ClearIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
		<path d="M8 1v2M8 13v2M15 8h-2M3 8H1M13.3 2.7l-1.4 1.4M4.1 11.9l-1.4 1.4M13.3 13.3l-1.4-1.4M4.1 4.1L2.7 2.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
	</svg>
);

export default function DataWeatherInfo() {
	const weather = useDataStore((state) => state.state?.WeatherData);

	if (!weather) {
		return (
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
				{/* Primera fila móvil */}
				<div className="flex gap-4 lg:contents">
					<div className="h-6 w-20 animate-pulse rounded bg-zinc-700" />
					<div className="h-6 w-20 animate-pulse rounded bg-zinc-700" />
				</div>
				{/* Segunda fila móvil */}
				<div className="flex gap-4 lg:contents">
					<div className="h-6 w-20 animate-pulse rounded bg-zinc-700" />
					<div className="h-6 w-24 animate-pulse rounded bg-zinc-700" />
				</div>
				{/* Tercera fila móvil */}
				<div className="flex lg:contents">
					<div className="h-6 w-16 animate-pulse rounded bg-zinc-700" />
				</div>
			</div>
		);
	}

	const trackTemp = Math.round(parseFloat(weather.TrackTemp));
	const airTemp = Math.round(parseFloat(weather.AirTemp));
	const humidity = parseFloat(weather.Humidity);
	const windSpeed = parseFloat(weather.WindSpeed);
	const windDirection = getWindDirection(parseInt(weather.WindDirection));
	const isRaining = weather.Rainfall === "1";

	return (
		<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6 text-sm">
			{/* Primera fila móvil: Pista y Aire */}
			<div className="flex gap-4 lg:contents">
				<div className="flex items-center gap-1.5">
					<TrackTempIcon />
					<span className="font-medium text-gray-300">Pista:</span>
					<span className="font-mono font-semibold text-white">{trackTemp}°C</span>
				</div>
				
				<div className="flex items-center gap-1.5">
					<AirTempIcon />
					<span className="font-medium text-gray-300">Aire:</span>
					<span className="font-mono font-semibold text-white">{airTemp}°C</span>
				</div>
			</div>
			
			{/* Segunda fila móvil: Humedad y Viento */}
			<div className="flex gap-4 lg:contents">
				<div className="flex items-center gap-1.5">
					<HumidityIcon />
					<span className="font-medium text-gray-300">Humedad:</span>
					<span className="font-mono font-semibold text-white">{humidity}%</span>
				</div>
				
				<div className="flex items-center gap-1.5">
					<WindIcon />
					<span className="font-medium text-gray-300">Viento:</span>
					<span className="font-mono font-semibold text-white">{windDirection} {windSpeed} m/s</span>
				</div>
			</div>
			
			{/* Tercera fila móvil: Estado del clima */}
			<div className="flex lg:contents">
				<div className="flex items-center gap-1.5">
					{isRaining ? <RainIcon /> : <ClearIcon />}
					<span className="font-medium text-gray-300">Estado:</span>
					<span className="font-mono font-semibold text-white">{isRaining ? "Lluvia" : "Despejado"}</span>
				</div>
			</div>
		</div>
	);
}
