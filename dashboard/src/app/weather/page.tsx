"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
	ArrowLeft,
	Activity,
	Wind,
	Droplets,
	CloudRain,
	Thermometer,
	MapPin,
	Radio,
	ChevronDown,
	Compass,
	Sun
} from "lucide-react";
import WeatherMap from "@/components/weather/WeatherMap";
import Flag from "@/components/Flag";
import SupportFooter from "@/components/SupportFooter";
import { getNextEvent } from "@/data/f1-calendar";

export type TrackWeatherInfo = {
	id: string;
	name: string;
	circuitName: string;
	countryName: string;
	countryCode: string;
	lat: number;
	lon: number;
};

export const TRACK_LOCATIONS: TrackWeatherInfo[] = [
	{ id: "bahrain", name: "Bahrain GP", circuitName: "Bahrain International Circuit", countryName: "Bahrain", countryCode: "brn", lat: 26.0325, lon: 50.5106 },
	{ id: "australia", name: "Australian GP", circuitName: "Albert Park Circuit", countryName: "Australia", countryCode: "aus", lat: -37.8497, lon: 144.968 },
	{ id: "china", name: "Chinese GP", circuitName: "Shanghai International Circuit", countryName: "China", countryCode: "chn", lat: 31.3389, lon: 121.22 },
	{ id: "japan", name: "Japanese GP", circuitName: "Suzuka Circuit", countryName: "Japan", countryCode: "jpn", lat: 34.8431, lon: 136.541 },
	{ id: "saudi", name: "Saudi Arabian GP", circuitName: "Jeddah Corniche Circuit", countryName: "Saudi Arabia", countryCode: "ksa", lat: 21.6319, lon: 39.1044 },
	{ id: "miami", name: "Miami GP", circuitName: "Miami International Autodrome", countryName: "United States", countryCode: "usa", lat: 25.9581, lon: -80.2389 },
	{ id: "canada", name: "Canadian GP", circuitName: "Circuit Gilles Villeneuve", countryName: "Canada", countryCode: "can", lat: 45.5000, lon: -73.5228 },
	{ id: "monaco", name: "Monaco GP", circuitName: "Circuit de Monaco", countryName: "Monaco", countryCode: "mon", lat: 43.7347, lon: 7.4206 },
	{ id: "spain", name: "Spanish GP", circuitName: "Circuit de Barcelona-Catalunya", countryName: "Spain", countryCode: "esp", lat: 41.5700, lon: 2.2611 },
	{ id: "austria", name: "Austrian GP", circuitName: "Red Bull Ring", countryName: "Austria", countryCode: "aut", lat: 47.2197, lon: 14.7647 },
	{ id: "britain", name: "British GP", circuitName: "Silverstone Circuit", countryName: "United Kingdom", countryCode: "gbr", lat: 52.0786, lon: -1.0169 },
	{ id: "belgium", name: "Belgian GP", circuitName: "Circuit de Spa-Francorchamps", countryName: "Belgium", countryCode: "bel", lat: 50.4372, lon: 5.9714 },
	{ id: "hungary", name: "Hungarian GP", circuitName: "Hungaroring", countryName: "Hungary", countryCode: "hun", lat: 47.5830, lon: 19.2486 },
	{ id: "netherlands", name: "Dutch GP", circuitName: "Circuit Zandvoort", countryName: "Netherlands", countryCode: "ned", lat: 52.3889, lon: 4.5403 },
	{ id: "italy", name: "Italian GP", circuitName: "Autodromo Nazionale Monza", countryName: "Italy", countryCode: "ita", lat: 45.6156, lon: 9.2811 },
	{ id: "azerbaijan", name: "Azerbaijan GP", circuitName: "Baku City Circuit", countryName: "Azerbaijan", countryCode: "aze", lat: 40.3725, lon: 49.8533 },
	{ id: "singapore", name: "Singapore GP", circuitName: "Marina Bay Street Circuit", countryName: "Singapore", countryCode: "sgp", lat: 1.2914, lon: 103.864 },
	{ id: "usa", name: "United States GP", circuitName: "Circuit of the Americas", countryName: "United States", countryCode: "usa", lat: 30.1328, lon: -97.6411 },
	{ id: "mexico", name: "Mexico City GP", circuitName: "Autódromo Hermanos Rodríguez", countryName: "Mexico", countryCode: "mex", lat: 19.4042, lon: -99.0907 },
	{ id: "brazil", name: "São Paulo GP", circuitName: "Autódromo de Interlagos", countryName: "Brazil", countryCode: "bra", lat: -23.7036, lon: -46.6997 },
	{ id: "vegas", name: "Las Vegas GP", circuitName: "Las Vegas Strip Circuit", countryName: "United States", countryCode: "usa", lat: 36.1147, lon: -115.168 },
	{ id: "qatar", name: "Qatar GP", circuitName: "Lusail International Circuit", countryName: "Qatar", countryCode: "qat", lat: 25.4900, lon: 51.4542 },
	{ id: "abudhabi", name: "Abu Dhabi GP", circuitName: "Yas Marina Circuit", countryName: "United Arab Emirates", countryCode: "uae", lat: 24.4672, lon: 54.6031 },
];

type OpenMeteoCurrent = {
	time?: string;
	temperature_2m: number;
	relative_humidity_2m: number;
	apparent_temperature: number;
	precipitation: number;
	rain: number;
	showers: number;
	snowfall: number;
	weather_code: number;
	cloud_cover: number;
	wind_speed_10m: number;
};

type OpenMeteoDaily = {
	time: string[];
	weather_code: number[];
	temperature_2m_max: number[];
	temperature_2m_min: number[];
	precipitation_probability_max: number[];
};

type OpenMeteoHourly = {
	time: string[];
	temperature_2m: number[];
	precipitation_probability: number[];
	weather_code: number[];
};

type OpenMeteoResponse = {
	timezone?: string;
	current: OpenMeteoCurrent;
	daily: OpenMeteoDaily;
	hourly?: OpenMeteoHourly;
};

function getWeatherInfo(wmoCode: number): { emoji: string; description: string; statusBadge: string; isRainRisk: boolean } {
	if (wmoCode === 0) return { emoji: "☀️", description: "Clear Skies", statusBadge: "DRY TRACK ☀️", isRainRisk: false };
	if (wmoCode >= 1 && wmoCode <= 3) return { emoji: "⛅", description: "Partly Cloudy", statusBadge: "DRY TRACK ⛅", isRainRisk: false };
	if (wmoCode >= 45 && wmoCode <= 48) return { emoji: "🌫️", description: "Foggy / Low Vis", statusBadge: "LOW VISIBILITY 🌫️", isRainRisk: false };
	if (wmoCode >= 51 && wmoCode <= 55) return { emoji: "🌧️", description: "Light Drizzle", statusBadge: "DAMP TRACK 🌧️", isRainRisk: true };
	if (wmoCode >= 61 && wmoCode <= 65) return { emoji: "🌧️", description: "Rain / Wet Track", statusBadge: "WET TRACK 🌧️", isRainRisk: true };
	if (wmoCode >= 71 && wmoCode <= 77) return { emoji: "❄️", description: "Snow / Cold", statusBadge: "COLD TRACK ❄️", isRainRisk: true };
	if (wmoCode >= 80 && wmoCode <= 82) return { emoji: "🌦️", description: "Rain Showers", statusBadge: "RAIN RISK 🌦️", isRainRisk: true };
	if (wmoCode >= 95 && wmoCode <= 99) return { emoji: "⛈️", description: "Thunderstorm", statusBadge: "SEVERE WET ⛈️", isRainRisk: true };
	return { emoji: "🌡️", description: "Variable", statusBadge: "TRACK WEATHER", isRainRisk: false };
}

function getShortDayLabel(index: number, isoDate: string) {
	if (index === 0) return "Today";
	if (index === 1) return "Tomorrow";
	return new Date(isoDate).toLocaleDateString("en-US", { weekday: "short" });
}

function WeatherPageContent() {
	const searchParams = useSearchParams();
	const from = searchParams.get("from");
	const backHref = from === "home" ? "/" : "/dashboard";

	// Automatically detect active GP or default to Italy/Monza
	const defaultTrack = useMemo(() => {
		const nextEv = getNextEvent();
		if (nextEv) {
			const matched = TRACK_LOCATIONS.find((t) =>
				nextEv.countryName.toLowerCase().includes(t.countryName.toLowerCase()) ||
				nextEv.name.toLowerCase().includes(t.id.toLowerCase())
			);
			if (matched) return matched;
		}
		return TRACK_LOCATIONS.find((t) => t.id === "italy") || TRACK_LOCATIONS[0];
	}, []);

	const [selectedTrack, setSelectedTrack] = useState<TrackWeatherInfo>(defaultTrack);
	const [data, setData] = useState<OpenMeteoResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedDayIndex, setSelectedDayIndex] = useState(0);

	useEffect(() => {
		const controller = new AbortController();

		const fetchWeather = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=${selectedTrack.lat}&longitude=${selectedTrack.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m,precipitation_probability,weather_code&timezone=auto`,
					{ signal: controller.signal }
				);

				if (!response.ok) {
					throw new Error("Failed to fetch circuit weather data");
				}

				const json = (await response.json()) as OpenMeteoResponse;
				setData(json);
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") {
					return;
				}
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError(String(err));
				}
			} finally {
				setLoading(false);
			}
		};

		fetchWeather();
		return () => controller.abort();
	}, [selectedTrack]);

	const current = data?.current;
	const daily = data?.daily;
	const hourly = data?.hourly;
	const todayWeather = current ? getWeatherInfo(current.weather_code) : null;
	const todayPop = daily?.precipitation_probability_max?.[selectedDayIndex] ?? 0;

	let hourlySlices: {
		time: string;
		temperature: number;
		precipitationProbability: number;
		weatherCode: number;
	}[] = [];

	if (
		hourly &&
		hourly.time &&
		hourly.temperature_2m &&
		hourly.precipitation_probability &&
		hourly.weather_code
	) {
		const hoursPerDay = 24;
		const availableDays = Math.floor(hourly.time.length / hoursPerDay);
		const safeDayIndex = Math.max(0, Math.min(selectedDayIndex, availableDays - 1));
		const start = safeDayIndex * hoursPerDay;
		const end = start + hoursPerDay;

		hourlySlices = hourly.time.slice(start, end).map((time, idx) => ({
			time,
			temperature: hourly.temperature_2m[start + idx],
			precipitationProbability: hourly.precipitation_probability[start + idx],
			weatherCode: hourly.weather_code[start + idx],
		}));
	}

	return (
		<div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
			{/* Ambient Dynamic Background Lights */}
			<div className="absolute top-[0%] right-[-10%] md:right-[5%] w-72 md:w-[500px] h-72 md:h-[500px] bg-blue-500/10 blur-[90px] md:blur-[130px] rounded-full pointer-events-none animate-slow-glow" />
			<div
				className="absolute bottom-[10%] left-[-10%] md:left-[5%] w-64 md:w-[450px] h-64 md:h-[450px] bg-cyan-500/10 blur-[85px] md:blur-[120px] rounded-full pointer-events-none animate-slow-glow"
				style={{ animationDelay: "-4s" }}
			/>

			{/* Motorsport HUD Navigation Header */}
			<header className="sticky top-0 left-0 z-40 w-full border-b border-neutral-800/80 bg-[#0a0a0a]/90 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-3.5">
				<div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
					{/* Left: Back Link & Brand */}
					<Link
						href={backHref}
						prefetch={false}
						className="group flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors"
					>
						<div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 transition-all">
							<ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
						</div>
						<div className="flex flex-col">
							<span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-white group-hover:text-cyan-400 transition-colors">
								FORMULETRY
							</span>
							<span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
								Live Weather
							</span>
						</div>
					</Link>

					{/* Right: Direct Dashboard CTA */}
					<Link
						href="/dashboard"
						prefetch={false}
						className="relative overflow-hidden bg-gradient-to-r from-[#0052ff] to-[#00a3e0] text-white font-bold text-xs sm:text-sm py-2 px-3.5 sm:px-4 rounded-xl uppercase tracking-wider shadow-md shadow-blue-500/15 hover:shadow-blue-500/25 hover:brightness-110 flex items-center gap-1.5 transition-all"
					>
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-sweep" />
						<Activity className="w-4 h-4 shrink-0" />
						<span className="relative z-10 hidden sm:inline">Launch Dashboard</span>
						<span className="relative z-10 sm:hidden">Dashboard</span>
					</Link>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="relative z-10 px-4 sm:px-6 md:px-8 py-8 md:py-12 flex-1">
				<div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
					{/* Header with Circuit Selector */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
						<div>
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono mb-2 shadow-xs">
								<Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
								<span>LIVE METEOROLOGY & RADAR</span>
							</div>
							<h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
								{selectedTrack.name} Weather
							</h1>
							<p className="text-xs sm:text-sm text-neutral-400 font-medium">
								{selectedTrack.circuitName} · {selectedTrack.countryName}
							</p>
						</div>

						{/* Track Selector Dropdown */}
						<div className="w-full sm:w-auto shrink-0">
							<label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-1.5">
								Select Circuit (24 Tracks)
							</label>
							<div className="relative">
								<select
									value={selectedTrack.id}
									onChange={(e) => {
										const track = TRACK_LOCATIONS.find((t) => t.id === e.target.value);
										if (track) {
											setSelectedTrack(track);
											setSelectedDayIndex(0);
										}
									}}
									aria-label="Select Circuit (24 Tracks)"
									className="w-full sm:w-64 appearance-none bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-white font-bold text-xs sm:text-sm rounded-xl py-2.5 pl-4 pr-10 shadow-lg cursor-pointer focus:outline-none focus:border-cyan-500"
								>
									{TRACK_LOCATIONS.map((track) => (
										<option key={track.id} value={track.id} className="bg-neutral-900 text-white">
											{track.name} ({track.countryName})
										</option>
									))}
								</select>
								<ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
							</div>
						</div>
					</div>

					{/* Weather Content */}
					{loading ? (
						<div className="grid gap-6">
							<div className="h-64 rounded-3xl bg-[#1a1a1a] border border-neutral-800 animate-pulse" />
							<div className="h-96 rounded-3xl bg-[#141414] border border-neutral-800 animate-pulse" />
						</div>
					) : error ? (
						<div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-center text-red-400">
							<p className="font-bold">Error loading weather telemetry: {error}</p>
							<p className="text-xs text-neutral-400 mt-1">Please check your connection and try again.</p>
						</div>
					) : !data || !current || !daily || !todayWeather ? (
						<div className="rounded-2xl bg-neutral-900 p-6 text-center text-neutral-400">
							<p>Weather telemetry data unavailable for this coordinate.</p>
						</div>
					) : (
						<div className="space-y-6 md:space-y-8">
							{/* Hero Weather Card */}
							<div className="rounded-3xl bg-[#1a1a1a] border border-neutral-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/70 to-transparent pointer-events-none" />
								<div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

								<div className="relative z-10 space-y-6">
									{/* Top Track & GPS */}
									<div className="flex items-center gap-3 border-b border-neutral-800/80 pb-4">
										<Flag
											countryCode={selectedTrack.countryCode}
											className="h-9 w-14 rounded-lg shadow-md border border-neutral-700/60 shrink-0"
										/>
										<div>
											<span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
												GPS {selectedTrack.lat.toFixed(2)}°N, {selectedTrack.lon.toFixed(2)}°E
											</span>
											<h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-white">
												{selectedTrack.circuitName}
											</h2>
										</div>
									</div>

									{/* Temperature & Metrics Grid */}
									<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
										{/* Main Temp display */}
										<div className="lg:col-span-5 flex items-center gap-5">
											<span className="text-6xl sm:text-7xl leading-none select-none">
												{todayWeather.emoji}
											</span>
											<div>
												<div className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-mono tracking-tighter text-white leading-none">
													{Math.round(current.temperature_2m)}°C
												</div>
												<p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-400 mt-1">
													{todayWeather.description}
												</p>
											</div>
										</div>

										{/* 4 Telemetry Metrics */}
										<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
											{/* Feels Like */}
											<div className="rounded-2xl bg-neutral-950/80 border border-neutral-800/90 p-3.5 flex flex-col justify-between shadow-inner">
												<div className="flex items-center gap-1.5 text-neutral-400 mb-1">
													<Thermometer className="w-4 h-4 text-amber-400" />
													<span className="text-[10px] font-bold uppercase tracking-wider">Feels Like</span>
												</div>
												<span className="text-lg sm:text-xl font-extrabold font-mono text-white">
													{Math.round(current.apparent_temperature)}°C
												</span>
											</div>

											{/* Rain Pop */}
											<div className="rounded-2xl bg-neutral-950/80 border border-neutral-800/90 p-3.5 flex flex-col justify-between shadow-inner">
												<div className="flex items-center gap-1.5 text-neutral-400 mb-1">
													<CloudRain className="w-4 h-4 text-cyan-400" />
													<span className="text-[10px] font-bold uppercase tracking-wider">Rain Prob</span>
												</div>
												<span className="text-lg sm:text-xl font-extrabold font-mono text-cyan-400">
													{Math.round(todayPop)}%
												</span>
											</div>

											{/* Wind */}
											<div className="rounded-2xl bg-neutral-950/80 border border-neutral-800/90 p-3.5 flex flex-col justify-between shadow-inner">
												<div className="flex items-center gap-1.5 text-neutral-400 mb-1">
													<Wind className="w-4 h-4 text-blue-400" />
													<span className="text-[10px] font-bold uppercase tracking-wider">Wind</span>
												</div>
												<span className="text-lg sm:text-xl font-extrabold font-mono text-white">
													{Math.round(current.wind_speed_10m)} <span className="text-xs font-normal text-neutral-400">km/h</span>
												</span>
											</div>

											{/* Humidity */}
											<div className="rounded-2xl bg-neutral-950/80 border border-neutral-800/90 p-3.5 flex flex-col justify-between shadow-inner">
												<div className="flex items-center gap-1.5 text-neutral-400 mb-1">
													<Droplets className="w-4 h-4 text-emerald-400" />
													<span className="text-[10px] font-bold uppercase tracking-wider">Humidity</span>
												</div>
												<span className="text-lg sm:text-xl font-extrabold font-mono text-white">
													{Math.round(current.relative_humidity_2m)}%
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* 7-Day Forecast Carousel on Mobile / Grid on Desktop */}
							<div className="space-y-3">
								<h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
									7-Day Track Outlook
								</h3>

								<div className="flex overflow-x-auto gap-2.5 no-scrollbar pb-2 md:grid md:grid-cols-7">
									{daily.time.map((isoDate, i) => {
										const info = getWeatherInfo(daily.weather_code[i] ?? 0);
										const pop = daily.precipitation_probability_max[i] ?? 0;
										const tMax = daily.temperature_2m_max[i] ?? 0;
										const tMin = daily.temperature_2m_min[i] ?? 0;
										const isSelected = selectedDayIndex === i;

										return (
											<button
												key={isoDate}
												type="button"
												onClick={() => setSelectedDayIndex(i)}
												className={`rounded-2xl p-3.5 flex flex-col items-center justify-between border transition-all cursor-pointer shadow-md min-w-[92px] sm:min-w-[105px] md:min-w-0 md:flex-1 shrink-0 ${
													isSelected
														? "border-cyan-500 bg-[#0c1322] shadow-[0_0_18px_rgba(6,182,212,0.2)] text-white"
														: "border-neutral-800 bg-neutral-950 hover:border-neutral-700 text-neutral-300"
												}`}
											>
												<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
													{getShortDayLabel(i, isoDate)}
												</span>
												<span className="text-3xl my-2 select-none">{info.emoji}</span>
												<span className="text-xs font-mono font-bold text-cyan-400">
													{Math.round(pop)}%
												</span>
												<div className="text-[11px] font-mono mt-1 space-x-1">
													<span className="text-white font-bold">{Math.round(tMax)}°</span>
													<span className="text-neutral-500">{Math.round(tMin)}°</span>
												</div>
											</button>
										);
									})}
								</div>
							</div>

							{/* Hourly Forecast Carousel */}
							{hourlySlices.length > 0 && (
								<div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5 space-y-3 shadow-lg">
									<div className="flex items-center justify-between">
										<h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
											Hourly Track Timeline ({getShortDayLabel(selectedDayIndex, daily.time[selectedDayIndex])})
										</h3>
										<span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
											Local Circuit Time
										</span>
									</div>

									<div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
										{hourlySlices.map((hour, index) => {
											const info = getWeatherInfo(hour.weatherCode);
											const timeLabel = hour.time.slice(11, 16);
											const hasRain = hour.precipitationProbability > 0;

											return (
												<div
													key={`${hour.time}-${index}`}
													className="rounded-xl bg-neutral-950/80 border border-neutral-800/80 px-3.5 py-3 flex flex-col items-center justify-between min-w-[72px] shrink-0 shadow-inner"
												>
													<span className="text-[11px] font-mono font-bold text-neutral-400">
														{timeLabel}
													</span>
													<span className="text-2xl my-1.5 select-none">{info.emoji}</span>
													{hasRain ? (
														<span className="text-[10px] font-mono font-bold text-cyan-400">
															{Math.round(hour.precipitationProbability)}%
														</span>
													) : (
														<span className="text-[10px] text-neutral-600 font-mono">-</span>
													)}
													<span className="text-xs font-mono font-bold text-white mt-1">
														{Math.round(hour.temperature)}°
													</span>
												</div>
											);
										})}
									</div>
								</div>
							)}

							{/* Live Doppler Radar Map Section */}
							<section className="space-y-3 pt-2">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
										<h3 className="text-xs font-bold uppercase tracking-widest text-white">
											Live Doppler Radar ({selectedTrack.circuitName})
										</h3>
									</div>
									<span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 font-mono">
										Powered by Windy
									</span>
								</div>

								<div className="h-[480px] md:h-[560px] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
									<WeatherMap
										lat={selectedTrack.lat}
										lon={selectedTrack.lon}
										trackName={selectedTrack.circuitName}
									/>
								</div>
							</section>
						</div>
					)}
				</div>
			</main>

			{/* Support Footer */}
			<SupportFooter />
		</div>
	);
}

export default function WeatherPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
					Loading Weather Telemetry...
				</div>
			}
		>
			<WeatherPageContent />
		</Suspense>
	);
}