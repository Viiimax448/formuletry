"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Settings, Map, Bell, Table, Gauge, Check } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	isOpen?: boolean;
	onClose: () => void;
};

// Switch nativo estilo iOS / Apple Human Interface Guidelines compacto
const AppleToggle = ({
	active,
	onClick,
	label,
	description,
}: {
	active: boolean;
	onClick: () => void;
	label: string;
	description?: string;
}) => (
	<div
		onClick={onClick}
		className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.08] cursor-pointer transition-all duration-150 select-none active:scale-[0.99]"
	>
		<div className="flex flex-col pr-2.5 min-w-0">
			<span className="text-xs font-semibold text-white/90 group-hover:text-white tracking-tight leading-tight">
				{label}
			</span>
			{description && (
				<span className="text-[10px] text-white/40 mt-0.5 leading-tight">
					{description}
				</span>
			)}
		</div>
		<button
			type="button"
			role="switch"
			aria-checked={active}
			className={`w-8.5 h-4.5 shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-out flex items-center ${
				active ? "bg-emerald-500" : "bg-white/15"
			}`}
		>
			<motion.div
				layout
				transition={{ type: "spring", stiffness: 600, damping: 35 }}
				className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm ${
					active ? "translate-x-4" : "translate-x-0"
				}`}
			/>
		</button>
	</div>
);

export default function SettingsModal({ isOpen = true, onClose }: Props) {
	const settings = useSettingsStore();

	// Soporte para cerrar con tecla Escape
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="settings-backdrop"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					onClick={onClose}
					className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs"
				>
					{/* Modal Container */}
					<motion.div
						key="settings-card"
						initial={{ opacity: 0, scale: 0.95, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 10 }}
						transition={{ type: "spring", stiffness: 420, damping: 28 }}
						onClick={(e) => e.stopPropagation()}
						className="relative w-full max-w-sm rounded-xl bg-[#151D2C] border border-gray-800/90 shadow-2xl flex flex-col text-white max-h-[92vh] overflow-hidden"
					>
						{/* Header */}
						<div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.08]">
							<div className="flex items-center gap-2">
								<div className="p-1 rounded-md bg-white/[0.05] border border-white/10 text-white/80">
									<Settings className="w-3.5 h-3.5" />
								</div>
								<div>
									<h2 className="text-xs font-bold text-white tracking-tight">Ajustes</h2>
									<p className="text-[10px] text-white/40 leading-none mt-0.5">Preferencias de visualización</p>
								</div>
							</div>
							<button
								onClick={onClose}
								className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
								title="Cerrar"
							>
								<X className="w-4 h-4" />
							</button>
						</div>

						{/* Body / Grouped list */}
						<div className="p-3 space-y-3 overflow-y-auto max-h-[78vh] text-xs">
							{/* Sección: Tabla & Telemetría */}
							<div className="space-y-1.5">
								<div className="flex items-center gap-1.5 px-0.5">
									<Table className="w-3 h-3 text-white/40" />
									<span className="text-[9.5px] font-bold tracking-wider uppercase text-white/45 font-mono">
										Tabla de Tiempos
									</span>
								</div>

								<div className="space-y-1">
									<AppleToggle
										label="Modo Compacto"
										description="Apila sectores en móvil para evitar scroll horizontal"
										active={settings.compactMode}
										onClick={() => settings.setCompactMode(!settings.compactMode)}
									/>

									<AppleToggle
										label="Encabezados de Columna"
										description="Muestra títulos POS, PILOTO, DIF, INT, S1, S2, S3"
										active={settings.tableHeaders}
										onClick={() => settings.setTableHeaders(!settings.tableHeaders)}
									/>

									{/* Unidad de Velocidad (KM/H por defecto) */}
									<div className="px-2.5 py-1.5 rounded-lg bg-white/[0.025] border border-white/[0.05] flex items-center justify-between">
										<div className="flex flex-col pr-2.5">
											<div className="flex items-center gap-1.5">
												<Gauge className="w-3 h-3 text-white/50" />
												<span className="text-xs font-semibold text-white/90 tracking-tight">
													Unidad de Velocidad
												</span>
											</div>
											<span className="text-[10px] text-white/40 mt-0.5">
												Métrica por defecto (KM/H)
											</span>
										</div>
										<div className="inline-flex rounded-md bg-white/[0.05] border border-white/[0.08] p-0.5 font-mono text-[10.5px]">
											<button
												onClick={() => settings.setSpeedUnit("metric")}
												className={`px-2 py-0.5 rounded transition-all font-semibold ${
													settings.speedUnit === "metric"
														? "bg-white text-black shadow-xs"
														: "text-white/50 hover:text-white"
												}`}
											>
												KM/H
											</button>
											<button
												onClick={() => settings.setSpeedUnit("imperial")}
												className={`px-2 py-0.5 rounded transition-all font-semibold ${
													settings.speedUnit === "imperial"
														? "bg-white text-black shadow-xs"
														: "text-white/50 hover:text-white"
												}`}
											>
												MPH
											</button>
										</div>
									</div>
								</div>
							</div>

							{/* Sección: Circuito */}
							<div className="space-y-1.5">
								<div className="flex items-center gap-1.5 px-0.5">
									<Map className="w-3 h-3 text-white/40" />
									<span className="text-[9.5px] font-bold tracking-wider uppercase text-white/45 font-mono">
										Circuito en Vivo
									</span>
								</div>

								<div className="space-y-1">
									<AppleToggle
										label="Números de Curvas"
										description="Muestra marcadores numéricos (T1, T2...) en el trazado"
										active={settings.showCornerNumbers}
										onClick={() => settings.setShowCornerNumbers(!settings.showCornerNumbers)}
									/>

									<AppleToggle
										label="Badges de Sectores"
										description="Destaca los límites de los sectores 1, 2 y 3"
										active={settings.showSectorNumbers}
										onClick={() => settings.setShowSectorNumbers(!settings.showSectorNumbers)}
									/>
								</div>
							</div>

							{/* Sección: Alertas & Sonido */}
							<div className="space-y-1.5">
								<div className="flex items-center gap-1.5 px-0.5">
									<Bell className="w-3 h-3 text-white/40" />
									<span className="text-[9.5px] font-bold tracking-wider uppercase text-white/45 font-mono">
										Alertas de Carrera
									</span>
								</div>

								<div className="space-y-1">
									<AppleToggle
										label="Chime de Dirección de Carrera"
										description="Aviso sonoro ante nuevas banderas o mensajes de FIA"
										active={settings.raceControlChime}
										onClick={() => settings.setRaceControlChime(!settings.raceControlChime)}
									/>

									{settings.raceControlChime && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.05] flex flex-col gap-1.5 overflow-hidden"
										>
											<div className="flex items-center justify-between text-xs">
												<span className="text-white/70 font-medium text-[11px]">Volumen de Alerta</span>
												<span className="font-mono text-white font-bold text-[11px]">
													{settings.raceControlChimeVolume}%
												</span>
											</div>
											<input
												type="range"
												min="0"
												max="100"
												value={settings.raceControlChimeVolume}
												onChange={(e) => settings.setRaceControlChimeVolume(Number(e.target.value))}
												className="w-full h-1.5 bg-white/[0.1] rounded-full appearance-none cursor-pointer accent-emerald-500"
											/>
										</motion.div>
									)}
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-end px-3.5 py-2.5 border-t border-white/[0.08] bg-white/[0.01]">
							<button
								onClick={onClose}
								className="py-1 px-3.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
							>
								<Check className="w-3.5 h-3.5" />
								<span>Listo</span>
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
