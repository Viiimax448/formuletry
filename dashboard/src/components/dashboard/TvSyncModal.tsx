"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Tv, Play, Pause, RotateCcw, Check } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export default function TvSyncModal({ isOpen, onClose }: Props) {
	const { delay, setDelay, delayIsPaused, setDelayIsPaused } = useSettingsStore();
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Contador automático de delay mientras la telemetría está en pausa
	useEffect(() => {
		if (isOpen && delayIsPaused) {
			const startDelay = useSettingsStore.getState().delay || 0;
			const startTime = Date.now();

			intervalRef.current = setInterval(() => {
				const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
				setDelay(startDelay + elapsedSeconds);
			}, 250);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isOpen, delayIsPaused, setDelay]);

	// Soporte para cerrar con tecla Escape
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	const adjustDelay = (seconds: number) => {
		const next = Math.max(0, (delay || 0) + seconds);
		setDelay(next);
	};

	const resetToLive = () => {
		setDelay(0);
		setDelayIsPaused(false);
	};

	const togglePause = () => {
		setDelayIsPaused(!delayIsPaused);
	};

	const handleConfirm = () => {
		if (delayIsPaused) {
			setDelayIsPaused(false);
		}
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="tv-sync-backdrop"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					onClick={onClose}
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
				>
					{/* Modal Card Centrada y Compacta */}
					<motion.div
						key="tv-sync-card"
						initial={{ opacity: 0, scale: 0.94, y: 8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.94, y: 8 }}
						transition={{ type: "spring", stiffness: 420, damping: 28 }}
						onClick={(e) => e.stopPropagation()}
						className="relative w-full max-w-[330px] rounded-xl bg-[#151D2C] border border-gray-800/90 p-4 shadow-2xl flex flex-col gap-3 text-white overflow-hidden"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
							<div className="flex items-center gap-2">
								<div className="p-1.5 rounded-md bg-white/[0.05] border border-white/10 text-white/80">
									<Tv className="w-3.5 h-3.5" />
								</div>
								<div>
									<h3 className="text-xs font-bold text-white tracking-tight">Sincronizar con TV</h3>
									<p className="text-[10px] text-white/40">Compensá el delay del streaming</p>
								</div>
							</div>
							<button
								onClick={onClose}
								className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
								title="Cerrar"
							>
								<X className="w-3.5 h-3.5" />
							</button>
						</div>

						{/* Estado actual / Display Digital */}
						<div className="p-3 rounded-lg bg-white/[0.025] border border-white/[0.06] flex items-center justify-between">
							<div className="flex flex-col">
								<span className="text-[9.5px] uppercase font-bold text-white/40 tracking-wider">
									ESTADO
								</span>
								<span className="text-xs font-medium text-white/80 mt-0.5">
									{delayIsPaused ? (
										<span className="text-amber-300 font-mono font-semibold">Pausado</span>
									) : delay === 0 ? (
										<span className="text-emerald-400 font-mono font-semibold">En Vivo</span>
									) : (
										<span>Retraso activo</span>
									)}
								</span>
							</div>

							<div className="flex items-baseline gap-1 font-mono">
								<span className="text-2xl font-black text-white tabular-nums tracking-tight">
									{delay === 0 ? "0" : `-${delay}`}
								</span>
								<span className="text-xs font-medium text-white/40">seg</span>
							</div>
						</div>

						{/* Botón Principal de Sincronización Táctil (Método intuitivo de pausa) */}
						<div>
							<button
								onClick={togglePause}
								className={`w-full py-2 px-3 rounded-lg font-medium text-xs flex items-center justify-between transition-all border ${
									delayIsPaused
										? "bg-amber-500/15 border-amber-500/35 text-amber-200"
										: "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white"
								}`}
							>
								<div className="flex items-center gap-2">
									{delayIsPaused ? (
										<Pause className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
									) : (
										<Play className="w-3.5 h-3.5 text-white/60" />
									)}
									<span className="text-xs font-semibold">
										{delayIsPaused ? "Reanudar (¡Listo!)" : "Pausar en un evento"}
									</span>
								</div>
								<span className="text-[10px] font-mono text-white/40">
									{delayIsPaused ? "Sumando..." : "Largada / Curva"}
								</span>
							</button>
						</div>

						{/* Ajuste fino por segundos */}
						<div className="flex flex-col gap-1.5">
							<span className="text-[9.5px] uppercase font-bold text-white/40 tracking-wider">
								AJUSTE RÁPIDO
							</span>
							<div className="grid grid-cols-4 gap-1.5 font-mono">
								<button
									onClick={() => adjustDelay(-5)}
									className="py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] active:scale-95 text-xs text-white/70 hover:text-white transition-all font-semibold"
								>
									-5s
								</button>
								<button
									onClick={() => adjustDelay(-1)}
									className="py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] active:scale-95 text-xs text-white/70 hover:text-white transition-all font-semibold"
								>
									-1s
								</button>
								<button
									onClick={() => adjustDelay(+1)}
									className="py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] active:scale-95 text-xs text-white/70 hover:text-white transition-all font-semibold"
								>
									+1s
								</button>
								<button
									onClick={() => adjustDelay(+5)}
									className="py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] active:scale-95 text-xs text-white/70 hover:text-white transition-all font-semibold"
								>
									+5s
								</button>
							</div>
						</div>

						{/* Acciones de pie: Reset y Confirmar */}
						<div className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
							{delay > 0 && (
								<button
									onClick={resetToLive}
									className="flex-1 py-1.5 px-2.5 rounded-md bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white/70 hover:text-white active:scale-95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
								>
									<RotateCcw className="w-3 h-3 text-red-400" />
									<span>Reset LIVE</span>
								</button>
							)}
							<button
								onClick={handleConfirm}
								className="flex-1 py-1.5 px-3 rounded-md bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-95 flex items-center justify-center gap-1.5 transition-all ml-auto"
							>
								<Check className="w-3 h-3" />
								<span>Aceptar</span>
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
