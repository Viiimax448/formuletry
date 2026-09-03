"use client";

type Props = {
  lat?: number;
  lon?: number;
  trackName?: string;
};

export default function WeatherMap({ lat = 52.3889, lon = 4.54028, trackName }: Props) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-neutral-950 relative border border-neutral-800 shadow-inner">
      <iframe 
        width="100%" 
        height="100%" 
        src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=11&overlay=radar&product=radar&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true`}
        frameBorder="0"
        title={`Live Weather Radar - ${trackName || "Circuit"}`}
        className="w-full h-full min-h-[480px] md:min-h-[540px]"
      />
    </div>
  );
}