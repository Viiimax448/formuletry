export default function WeatherMap() {
  // Coordenadas de Suzuka Circuit, Japón (puedes cambiarlas luego por variables)
  const lat = 34.8431;
  const lon = 136.5419;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-[#1F2937]">
      <iframe 
        width="100%" 
        height="100%" 
        src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=11&overlay=radar&product=radar&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true`}
        frameBorder="0"
        title="Live Weather Radar"
        className="w-full h-full"
      />
    </div>
  );
}