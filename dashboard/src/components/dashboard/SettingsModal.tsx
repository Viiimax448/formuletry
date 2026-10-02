"use client";

import { X, Monitor, Zap, Gauge, Tv, AlignJustify, Star, Play, Pause, RotateCcw, MapPin } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useEffect, useRef } from "react";

// Componente de Switch (Toggle)
const ToggleSwitch = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
      active ? "bg-blue-600" : "bg-gray-700"
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
        active ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  // Conexión con el Store
  const { 
    delay, setDelay, 
    delayIsPaused, setDelayIsPaused,
    oledMode, setOledMode,
    speedUnit, setSpeedUnit,
    compactMode, setCompactMode,
    circuitOverride, setCircuitOverride
  } = useSettingsStore();

  // Timer para incrementar delay cuando está pausado
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (delayIsPaused) {
      // Iniciar timer que incrementa el delay cada segundo
      intervalRef.current = setInterval(() => {
        const currentStore = useSettingsStore.getState();
        const currentDelay = currentStore.delay || 0;
        setDelay(currentDelay + 1);
      }, 1000);
    } else {
      // Limpiar timer cuando no está pausado
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup del timer al desmontar o cambiar estado
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [delayIsPaused, setDelay]);

  // Función para manejar el cambio en el input numérico
  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Si está vacío, establecer a 0
    if (value === '' || value === null || value === undefined) {
      setDelay(0);
      return;
    }
    
    const numericValue = Number(value);
    // Asegurarse de que es un número válido y no negativo
    if (!isNaN(numericValue) && numericValue >= 0) {
      setDelay(numericValue);
    }
  };

  // Función para pausar/reanudar el timer
  const togglePause = () => {
    setDelayIsPaused(!delayIsPaused);
  };

  // Función para resetear el delay
  const resetDelay = () => {
    setDelay(0);
    // Si estaba pausado, mantener la pausa pero resetear el valor
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1F2937] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-400" />
            Configuración
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[80vh]">
          
          {/* SECCIÓN 1: SINCRONIZACIÓN (DELAY) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Sincronización TV
              </h3>
              <span className="text-xs font-mono text-gray-400 bg-black/30 px-2 py-1 rounded">
                {(delay || 0) === 0 ? "LIVE" : `-${delay || 0}s DELAY`}
              </span>
            </div>

            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                    <Tv className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-white font-medium text-sm">Broadcast Delay</p>
                        <p className="text-xs text-gray-500">Ajusta para coincidir con tu TV (segundos)</p>
                    </div>
                </div>
                
                {/* Controles del Delay */}
                <div className="flex items-center gap-3">
                    {/* Input Numérico */}
                    <input
                        type="number"
                        min="0"
                        value={delay || 0}
                        onChange={handleDelayChange}
                        className="w-20 h-10 bg-[#111827] border border-white/10 rounded-lg text-white text-center font-mono focus:outline-none focus:border-blue-500 appearance-none"
                        disabled={delayIsPaused}
                    />

                    {/* Botón Pausa/Play */}
                    <button
                        onClick={togglePause}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                            delayIsPaused 
                                ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700' 
                                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                        title={delayIsPaused ? "Pausado (contador activo)" : "Activo"}
                    >
                        {delayIsPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    {/* Botón Reset */}
                    <button
                        onClick={resetDelay}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-600 border border-red-500 text-white hover:bg-red-700 transition-colors"
                        title="Reset delay"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                    {delayIsPaused 
                        ? "⏸️ Pausado - El delay se incrementa automáticamente" 
                        : "▶️ Activo - Usa el valor manual"
                    }
                </p>
            </div>
          </div>

          {/* SECCIÓN: VISUALIZACIÓN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Visualización
              </h3>
            </div>

            <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlignJustify className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium text-sm">Modo Compacto</p>
                  <p className="text-xs text-gray-500">Apila los sectores para evitar el scroll horizontal</p>
                </div>
              </div>
              <ToggleSwitch
                active={compactMode}
                onClick={() => setCompactMode(!compactMode)}
              />
            </div>
          </div>

          {/* SECCIÓN: CIRCUITO / MAPA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Mapa de Pista
              </h3>
            </div>

            <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium text-sm">Circuito a Visualizar</p>
                  <p className="text-xs text-gray-500">Fuerza el trazado si hubo cambios de sede</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCircuitOverride("auto")}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
                    circuitOverride === "auto"
                      ? "bg-blue-600/30 border-blue-500 text-white"
                      : "bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>⚡ Automático (según Live Timing / Fallback)</span>
                  {circuitOverride === "auto" && <span className="text-blue-400 text-xs">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setCircuitOverride("sepang")}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
                    circuitOverride === "sepang"
                      ? "bg-emerald-600/30 border-emerald-500 text-white"
                      : "bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>🇲🇾 Sepang (Malasia) [Sustituto Baréin]</span>
                  {circuitOverride === "sepang" && <span className="text-emerald-400 text-xs">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setCircuitOverride("bahrain")}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
                    circuitOverride === "bahrain"
                      ? "bg-blue-600/30 border-blue-500 text-white"
                      : "bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>🇧🇭 Sakhir (Baréin)</span>
                  {circuitOverride === "bahrain" && <span className="text-blue-400 text-xs">✓</span>}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}