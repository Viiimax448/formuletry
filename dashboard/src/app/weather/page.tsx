"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WeatherMap from "@/components/weather/WeatherMap";
import { Suspense } from "react";

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

function getWeatherInfo(wmoCode: number): { emoji: string; description: string } {
  if (wmoCode === 0) return { emoji: "☀️", description: "Despejado" };
  if (wmoCode >= 1 && wmoCode <= 3) return { emoji: "⛅", description: "Nublado" };
  if (wmoCode >= 45 && wmoCode <= 48) return { emoji: "🌫️", description: "Niebla" };
  if (wmoCode >= 51 && wmoCode <= 55) return { emoji: "🌧️", description: "Llovizna" };
  if (wmoCode >= 61 && wmoCode <= 65) return { emoji: "🌧️", description: "Lluvia" };
  if (wmoCode >= 71 && wmoCode <= 77) return { emoji: "❄️", description: "Nieve" };
  if (wmoCode >= 80 && wmoCode <= 82) return { emoji: "🌦️", description: "Chubascos" };
  if (wmoCode >= 95 && wmoCode <= 99) return { emoji: "⛈️", description: "Tormenta" };
  return { emoji: "🌡️", description: "Clima" };
}

function getShortDayLabel(index: number, isoDate: string) {
  if (index === 0) return "Hoy";
  const label = new Date(isoDate)
    .toLocaleDateString("es-ES", { weekday: "short" })
    .replace(".", "")
    .toLowerCase();
  return label;
}

function WeatherPageContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backHref = from === "home" ? "/" : "/dashboard";

  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=34.8431&longitude=136.5419&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m,precipitation_probability,weather_code&timezone=auto",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Error fetching weather data");
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
  }, []);

  const current = data?.current;
  const daily = data?.daily;
  const hourly = data?.hourly;
  const todayWeather = current ? getWeatherInfo(current.weather_code) : null;
  const todayPop = daily?.precipitation_probability_max?.[0] ?? 0;

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
    <div className="bg-[#111827] text-white min-h-screen p-4">
      {/* Header */}
      <header className="flex items-center mb-6">
			<Link href={backHref} prefetch={false} className="text-white hover:text-gray-300">
          <span className="text-xl">←</span>
        </Link>
        <h1 className="text-center flex-grow text-2xl font-bold">
          Track Weather & Live Radar
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-6">
        {/* Left Column */}
        <section>
          {loading ? (
            <p>Cargando pronóstico...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : !data || !current || !daily || !todayWeather ? (
            <p>Datos no disponibles</p>
          ) : (
            <>
              {/* Today */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 md:p-6">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl md:text-6xl leading-none">
                      {todayWeather.emoji}
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-6xl md:text-7xl font-semibold leading-none">
                        {Math.round(current.temperature_2m)}°
                      </div>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm text-gray-200 min-w-[170px]">
                    <div className="flex items-center justify-between gap-4 py-1">
                      <span className="text-gray-400">Sensación térmica</span>
                      <span>{Math.round(current.apparent_temperature)}°</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-1">
                      <span className="text-gray-400">Prob. de precipitación</span>
                      <span>{Math.round(todayPop)}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-1">
                      <span className="text-gray-400">Humedad</span>
                      <span>{Math.round(current.relative_humidity_2m)}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-1">
                      <span className="text-gray-400">Viento</span>
                      <span>{Math.round(current.wind_speed_10m)} km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7 Days */}
              <div className="flex justify-between mt-8">
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
              className={`flex-1 flex flex-col items-center px-3 md:px-4 py-1 rounded-lg transition-colors cursor-pointer ${
                isSelected ? "bg-white/10 ring-1 ring-white/20" : "bg-transparent hover:bg-white/5"
              }`}
            >
              <div className="text-[10px] md:text-sm font-medium capitalize text-gray-200">
                {getShortDayLabel(i, isoDate)}
              </div>
              <div className="text-xl md:text-4xl my-1 md:my-2">{info.emoji}</div>
              <div className="text-[10px] md:text-sm text-sky-400">
                {Math.round(pop)}%
              </div>
              <div className="text-[10px] md:text-sm mt-1 md:mt-2">
                <span className="text-white font-semibold">{Math.round(tMax)}°</span>{" "}
                <span className="text-gray-400">{Math.round(tMin)}°</span>
              </div>
            </button>
                  );
                })}
              </div>

          {/* Hourly Forecast Slider */}
          {hourlySlices.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h3 className="text-xs md:text-sm font-semibold text-gray-200 mb-2">
                Pronóstico por hora
              </h3>
              <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
                {hourlySlices.map((hour, index) => {
                  const info = getWeatherInfo(hour.weatherCode);
                  const timeLabel = hour.time.slice(11, 16); // "HH:MM" de la zona horaria ya ajustada
                  const showPop = hour.precipitationProbability > 0;

                  return (
                    <div
                      key={`${hour.time}-${index}`}
                      className="flex flex-col items-center min-w-[3rem] md:min-w-[3.5rem]"
                    >
                      <span className="text-[10px] md:text-xs text-gray-300 mb-1">
                        {timeLabel}
                      </span>
                      <span className="text-lg md:text-xl">
                        {info.emoji}
                      </span>
                      {showPop ? (
                        <span className="text-[10px] md:text-xs text-blue-400 font-semibold mt-0.5">
                          {Math.round(hour.precipitationProbability)}%
                        </span>
                      ) : (
                        <div className="h-4 mt-0.5" />
                      )}
                      <span className="text-xs md:text-sm text-white font-semibold mt-1">
                        {Math.round(hour.temperature)}°
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
            </>
          )}
        </section>

        {/* Right Column - Radar */}
        <section>
          <div className="h-[30rem] lg:h-full min-h-[500px] rounded-2xl overflow-hidden">
            <WeatherMap />
          </div>
        </section>
      </div>
    </div>
  );
}

export default function WeatherPage() {
  return (
    <Suspense fallback={<div className="bg-[#111827] text-white min-h-screen p-4">Cargando...</div>}>
      <WeatherPageContent />
    </Suspense>
  );
}