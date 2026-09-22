"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { utc } from "moment";
import { X } from "lucide-react";
import clsx from "clsx";

import type { Driver } from "@/types/state.type";
import { useDataStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useNotificationStore, type NotificationItem } from "@/stores/useNotificationStore";
import { toTrackTime } from "@/lib/toTrackTime";
import { getCustomTeamColor, getContrastColor } from "@/lib/teamColors";

const getDriverNumber = (message: string): string | undefined => {
	const match = message.match(/CAR (\d+)/i);
	return match?.[1];
};

export const getEventSeverity = (
	msgText: string,
	flag?: string,
	category?: string,
): NotificationItem["severity"] => {
	const upper = msgText.toUpperCase();
	if (flag === "RED" || upper.includes("RED FLAG") || upper.includes("SUSPENDED")) {
		return "red_flag";
	}
	if (upper.includes("VSC") || upper.includes("VIRTUAL SAFETY CAR")) {
		return "vsc";
	}
	if (category === "SafetyCar" || upper.includes("SAFETY CAR")) {
		return "safety_car";
	}
	if (flag === "YELLOW" || flag === "DOUBLE YELLOW" || upper.includes("YELLOW FLAG")) {
		return "yellow_flag";
	}
	if (flag === "BLACK AND WHITE" || upper.includes("WARNING") || upper.includes("TRACK LIMITS") || upper.includes("PENALTY")) {
		return "warning";
	}
	if (flag === "GREEN" || flag === "CLEAR" || upper.includes("CLEAR") || upper.includes("RESUMING")) {
		return "clear";
	}
	return "default";
};

export const isCriticalEvent = (msgText: string, flag?: string, category?: string) => {
	const upper = msgText.toUpperCase();
	return (
		flag === "RED" ||
		flag === "YELLOW" ||
		flag === "DOUBLE YELLOW" ||
		flag === "BLACK AND WHITE" ||
		category === "SafetyCar" ||
		upper.includes("SAFETY CAR") ||
		upper.includes("VSC") ||
		upper.includes("VIRTUAL SAFETY CAR") ||
		upper.includes("RED FLAG") ||
		upper.includes("YELLOW FLAG")
	);
};

export default function TrackEventNotification() {
	const messages = useDataStore((state) => state.state?.RaceControlMessages?.Messages);
	const drivers = useDataStore((state) => state.state?.DriverList);
	const gmtOffset = useDataStore((state) => state.state?.SessionInfo?.GmtOffset ?? "0");

	const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);
	const raceControlChime = useSettingsStore((state) => state.raceControlChime);
	const raceControlChimeVolume = useSettingsStore((state) => state.raceControlChimeVolume);

	const activeNotification = useNotificationStore((state) => state.activeNotification);
	const showNotification = useNotificationStore((state) => state.showNotification);
	const dismissNotification = useNotificationStore((state) => state.dismissNotification);

	const lastSeenMessageKey = useRef<string | null>(null);
	const isFirstMount = useRef<boolean>(true);

	// Sonido de Chime al activarse
	useEffect(() => {
		if (activeNotification && raceControlChime) {
			try {
				const audio = new Audio("/sounds/racecontrol.mp3");
				audio.volume = Math.max(0.1, raceControlChimeVolume / 100);
				audio.play().catch(() => {});
			} catch (_) {}
		}
	}, [activeNotification?.id, raceControlChime, raceControlChimeVolume]);

	// Observar nuevos mensajes entrantes de Live Timing
	useEffect(() => {
		if (!messages || messages.length === 0) return;

		const latest = messages[messages.length - 1];
		const messageKey = `${latest.Utc}_${latest.Message}`;

		if (isFirstMount.current) {
			isFirstMount.current = false;
			lastSeenMessageKey.current = messageKey;
			return;
		}

		if (lastSeenMessageKey.current !== messageKey) {
			lastSeenMessageKey.current = messageKey;

			if (isCriticalEvent(latest.Message, latest.Flag, latest.Category)) {
				const carNumber = getDriverNumber(latest.Message);
				const isDriverFavorite = carNumber ? favoriteDrivers.includes(carNumber) : false;

				const upper = latest.Message.toUpperCase();
				const isGlobalTrackEvent =
					latest.Flag === "RED" ||
					latest.Flag === "YELLOW" ||
					latest.Flag === "DOUBLE YELLOW" ||
					latest.Category === "SafetyCar" ||
					upper.includes("SAFETY CAR") ||
					upper.includes("VSC") ||
					upper.includes("VIRTUAL SAFETY CAR") ||
					upper.includes("RED FLAG") ||
					upper.includes("YELLOW FLAG");

				// Si el evento es solo de un piloto (ej. track limits, investigación individual),
				// solo notificar si ese piloto está marcado como favorito:
				if (!isGlobalTrackEvent && !isDriverFavorite) {
					return;
				}

				// Solo incluir el bloque del piloto si es un piloto favorito
				const driver = isDriverFavorite && carNumber && drivers ? drivers[carNumber] : undefined;

				showNotification({
					id: messageKey,
					message: latest.Message,
					flag: latest.Flag,
					category: latest.Category,
					lap: latest.Lap,
					utc: latest.Utc,
					driver,
					severity: getEventSeverity(latest.Message, latest.Flag, latest.Category),
				});
			}
		}
	}, [messages, drivers, favoriteDrivers, showNotification]);

	if (!activeNotification) return null;

	const localTime = utc(activeNotification.utc).local().format("HH:mm:ss");
	const trackTime = utc(toTrackTime(activeNotification.utc, gmtOffset)).format("HH:mm");
	const showDriverBadge = activeNotification.driver && favoriteDrivers.includes(activeNotification.driver.RacingNumber);
	const showFlagBadge = activeNotification.flag && activeNotification.flag !== "CLEAR";

	return (
		<div className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-[calc(100%-1.5rem)] sm:w-[480px] pointer-events-none">
			<AnimatePresence mode="wait">
				{activeNotification && (
					<motion.div
						key={activeNotification.id}
						initial={{ opacity: 0, y: -30, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -25, scale: 0.95 }}
						transition={{ type: "spring", stiffness: 450, damping: 32 }}
						className={clsx(
							"pointer-events-auto relative overflow-hidden rounded-lg bg-[#111827] p-2.5 px-3 border transition-colors duration-150",
							{
								// Borde Completo Fino y Suave
								"border-amber-400/60":
									activeNotification.severity === "safety_car" ||
									activeNotification.severity === "vsc" ||
									activeNotification.severity === "yellow_flag",
								"border-red-500/60": activeNotification.severity === "red_flag",
								"border-orange-500/60": activeNotification.severity === "warning",
								"border-emerald-500/60": activeNotification.severity === "clear",
								"border-cyan-500/60": activeNotification.severity === "default",
							},
						)}
					>
						<div className="flex items-start justify-between gap-3">
							{/* Columna Izquierda: Vuelta, Horarios y Texto del Mensaje */}
							<div className="flex-1 min-w-0">
								{/* Fila Superior: Vuelta y Horarios */}
								<div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-mono">
									{activeNotification.lap !== undefined && activeNotification.lap !== null && (
										<span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] font-bold text-gray-200 border border-white/15 tracking-wider">
											VTA {activeNotification.lap}
										</span>
									)}

									<time dateTime={localTime} className="font-semibold text-gray-300">
										{localTime}
									</time>
									<span className="text-gray-600">•</span>
									<time className="text-gray-500 text-[10px]" dateTime={trackTime} title="Hora de pista">
										{trackTime}
									</time>
								</div>

								{/* Mensaje Oficial de Race Control */}
								<p className="font-sans text-xs leading-snug text-gray-100 font-medium">
									{activeNotification.message}
								</p>
							</div>

							{/* Columna Derecha: Bloque de Piloto (solo favoritos), Bandera y Botón Cerrar */}
							<div className="flex items-center gap-2 shrink-0">
								{(showDriverBadge || showFlagBadge) && (
									<div className="flex flex-col items-center justify-center gap-1.5 shrink-0">
										{showDriverBadge && <DriverVerticalBlock driver={activeNotification.driver!} />}
										{showFlagBadge && <PureRaceFlag flag={activeNotification.flag!} />}
									</div>
								)}

								{/* Botón Cerrar */}
								<button
									onClick={dismissNotification}
									className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors self-start -mr-1"
									title="Cerrar notificación"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Barra de progreso de auto-descarte plana y fina */}
						<motion.div
							key={`bar.${activeNotification.id}`}
							initial={{ width: "100%" }}
							animate={{ width: "0%" }}
							transition={{ duration: 5.5, ease: "linear" }}
							className={clsx("absolute bottom-0 left-0 h-[1.5px]", {
								"bg-amber-400/80":
									activeNotification.severity === "safety_car" ||
									activeNotification.severity === "vsc" ||
									activeNotification.severity === "yellow_flag",
								"bg-red-500/80": activeNotification.severity === "red_flag",
								"bg-orange-500/80": activeNotification.severity === "warning",
								"bg-emerald-400/80": activeNotification.severity === "clear",
								"bg-cyan-400/80": activeNotification.severity === "default",
							})}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

/**
 * Bloque Vertical de Piloto F1 (Opción B: Monocolor Sólido sin divisor, sin sombras)
 */
function DriverVerticalBlock({ driver }: { driver: Driver }) {
	const teamColor = getCustomTeamColor(driver.TeamColour, driver.Tla);
	const textColor = getContrastColor(teamColor);
	const isDarkText = textColor === "#090d16";
	const outerBorder = isDarkText ? "border-black/20" : "border-white/20";

	return (
		<div
			className={clsx(
				"flex flex-col items-stretch justify-center rounded-md overflow-hidden border min-w-[34px] w-[34px] select-none py-0.5",
				outerBorder,
			)}
			style={{ backgroundColor: teamColor, color: textColor }}
			title={`${driver.BroadcastName} (#${driver.RacingNumber})`}
		>
			<div className="flex items-center justify-center px-0.5 leading-none font-mono font-black text-xs tabular-nums">
				{driver.RacingNumber}
			</div>
			<div className="flex items-center justify-center px-0.5 pt-0.5">
				<span className="font-mono text-[9px] font-bold tracking-wider leading-none opacity-90">
					{driver.Tla}
				</span>
			</div>
		</div>
	);
}

/**
 * Banderas Rectangulares Puras 3:2 Oficiales sin mástil y sin sombras
 */
function PureRaceFlag({ flag }: { flag: string }) {
	const normalized = flag.toUpperCase().trim();

	if (normalized === "CLEAR") return null;

	return (
		<div className="flex items-center justify-center shrink-0" title={`Bandera ${normalized}`}>
			{normalized === "YELLOW" && (
				<div
					title="Bandera Amarilla"
					className="w-[27px] h-[18px] rounded-[3px] bg-yellow-400 border border-yellow-200/50"
				/>
			)}

			{normalized === "DOUBLE YELLOW" && (
				<div
					title="Doble Bandera Amarilla"
					className="w-[27px] h-[18px] rounded-[3px] overflow-hidden border border-yellow-200/50 flex gap-[1.5px] p-[1px] bg-black"
				>
					<div className="flex-1 bg-yellow-400 rounded-[1px]" />
					<div className="flex-1 bg-yellow-400 rounded-[1px]" />
				</div>
			)}

			{normalized === "RED" && (
				<div
					title="Bandera Roja"
					className="w-[27px] h-[18px] rounded-[3px] bg-red-600 border border-red-400/50"
				/>
			)}

			{normalized === "GREEN" && (
				<div
					title="Bandera Verde"
					className="w-[27px] h-[18px] rounded-[3px] bg-emerald-500 border border-emerald-300/50"
				/>
			)}

			{normalized === "BLUE" && (
				<div
					title="Bandera Azul"
					className="w-[27px] h-[18px] rounded-[3px] bg-blue-500 border border-blue-300/50"
				/>
			)}

			{normalized === "BLACK AND WHITE" && (
				<div
					title="Bandera Blanca y Negra (Límites de pista / Advertencia)"
					className="w-[27px] h-[18px] rounded-[3px] overflow-hidden border border-white/40 relative bg-white"
				>
					<svg className="w-full h-full block" viewBox="0 0 27 18" preserveAspectRatio="none">
						<polygon points="0,18 27,0 27,18" fill="#18181b" />
					</svg>
				</div>
			)}

			{normalized === "CHEQUERED" && (
				<div
					title="Bandera a Cuadros"
					className="w-[27px] h-[18px] rounded-[3px] overflow-hidden border border-white/40 bg-white"
				>
					<svg className="w-full h-full block" viewBox="0 0 24 16" preserveAspectRatio="none">
						<rect width="24" height="16" fill="#ffffff" />
						<rect x="0" y="0" width="4" height="4" fill="#18181b" />
						<rect x="8" y="0" width="4" height="4" fill="#18181b" />
						<rect x="16" y="0" width="4" height="4" fill="#18181b" />
						<rect x="4" y="4" width="4" height="4" fill="#18181b" />
						<rect x="12" y="4" width="4" height="4" fill="#18181b" />
						<rect x="20" y="4" width="4" height="4" fill="#18181b" />
						<rect x="0" y="8" width="4" height="4" fill="#18181b" />
						<rect x="8" y="8" width="4" height="4" fill="#18181b" />
						<rect x="16" y="8" width="4" height="4" fill="#18181b" />
						<rect x="4" y="12" width="4" height="4" fill="#18181b" />
						<rect x="12" y="12" width="4" height="4" fill="#18181b" />
						<rect x="20" y="12" width="4" height="4" fill="#18181b" />
					</svg>
				</div>
			)}
		</div>
	);
}
