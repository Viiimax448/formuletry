"use client";

import { motion } from "motion/react";
import { utc } from "moment";
import clsx from "clsx";

import type { Message, Driver } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";
import { toTrackTime } from "@/lib/toTrackTime";
import { getCustomTeamColor, getContrastColor } from "@/lib/teamColors";

type Props = {
	msg: Message;
	gmtOffset: string;
};

const getDriverNumber = (msg: Message): string | undefined => {
	const match = msg.Message.match(/CAR (\d+)/i);
	return match?.[1];
};

export function RaceControlMessage({ msg, gmtOffset }: Props) {
	const drivers = useDataStore((state) => state.state?.DriverList);
	const carNumber = getDriverNumber(msg);
	const driver: Driver | undefined = carNumber && drivers ? drivers[carNumber] : undefined;

	const favoriteDriver = useSettingsStore((state) =>
		carNumber ? state.favoriteDrivers.includes(carNumber) : false,
	);

	const localTime = utc(msg.Utc).local().format("HH:mm:ss");
	const trackTime = utc(toTrackTime(msg.Utc, gmtOffset)).format("HH:mm");

	const getMessageSeverity = (message: string, flag?: string) => {
		const upper = message.toUpperCase();
		if (upper.includes("PENALTY") || upper.includes("DISQUALIFIED") || flag === "RED" || flag === "BLACK AND WHITE") {
			return "penalty";
		}
		if (upper.includes("INVESTIGATION") || upper.includes("INCIDENT") || flag === "YELLOW" || flag === "DOUBLE YELLOW") {
			return "incident";
		}
		if (upper.includes("WARNING") || upper.includes("NOTED") || upper.includes("OFF TRACK")) {
			return "warning";
		}
		if (upper.includes("CLEAR") || upper.includes("ENABLED") || flag === "GREEN" || flag === "CHEQUERED") {
			return "clear";
		}
		if (upper.includes("SAFETY CAR") || upper.includes("VSC")) {
			return "safety_car";
		}
		return "default";
	};

	const severity = getMessageSeverity(msg.Message, msg.Flag);

	return (
		<motion.li
			layout="position"
			animate={{ opacity: 1, y: 0, scale: 1 }}
			initial={{ opacity: 0, y: 4, scale: 0.98 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.15 }}
			className={clsx(
				"group relative list-none rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] border-l-2 px-2.5 py-2 transition-colors duration-150",
				{
					"border-l-red-500": severity === "penalty",
					"border-l-amber-500": severity === "incident",
					"border-l-orange-500": severity === "warning",
					"border-l-amber-400": severity === "safety_car",
					"border-l-emerald-500": severity === "clear",
					"border-l-cyan-500": favoriteDriver && severity === "default",
					"border-l-gray-600": !favoriteDriver && severity === "default",
				},
			)}
		>
			<div className="flex items-center justify-between gap-3">
				{/* Columna Izquierda: Información de carrera y texto */}
				<div className="flex-1 min-w-0">
					{/* Fila Superior: Vuelta y Horarios */}
					<div className="mb-1 flex items-center gap-1.5 text-[11px] font-mono">
						{msg.Lap !== undefined && msg.Lap !== null && (
							<span className="rounded bg-white/5 px-1.5 py-0.2 text-[9px] font-bold text-gray-300 border border-white/10 tracking-wider">
								VTA {msg.Lap}
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

					{/* Contenido del Mensaje */}
					<p className="font-sans text-xs leading-snug text-gray-200 font-medium">
						{msg.Message}
					</p>
				</div>

				{/* Columna Derecha: Bloque de Piloto Vertical y/o Bandera Rectangular 3:2 */}
				{(driver || (msg.Flag && msg.Flag !== "CLEAR")) && (
					<div className="flex flex-col items-center justify-center gap-1.5 shrink-0">
						{driver && <DriverVerticalBlock driver={driver} />}
						{msg.Flag && msg.Flag !== "CLEAR" && <PureRaceFlag flag={msg.Flag} />}
					</div>
				)}
			</div>
		</motion.li>
	);
}

/**
 * Bloque Vertical Monocolor Sólido de Escudería (Opción B)
 * - Todo el bloque tiene el color oficial de la escudería
 * - Número arriba en grande y 3 letras TLA abajo con contraste inteligente
 * - Sin línea divisoria para un bloque limpio y continuo
 */
function DriverVerticalBlock({ driver }: { driver: Driver }) {
	const teamColor = getCustomTeamColor(driver.TeamColour, driver.Tla);
	const textColor = getContrastColor(teamColor);
	const isDarkText = textColor === "#090d16";
	const outerBorder = isDarkText ? "border-black/20" : "border-white/20";

	return (
		<div
			className={clsx(
				"flex flex-col items-stretch justify-center rounded-md overflow-hidden border shadow-sm min-w-[34px] w-[34px] select-none py-0.5",
				outerBorder,
			)}
			style={{ backgroundColor: teamColor, color: textColor }}
			title={`${driver.BroadcastName} (#${driver.RacingNumber})`}
		>
			{/* Número Arriba */}
			<div className="flex items-center justify-center px-0.5 leading-none font-mono font-black text-xs tabular-nums">
				{driver.RacingNumber}
			</div>

			{/* 3 Letras TLA Abajo */}
			<div className="flex items-center justify-center px-0.5 pt-0.5">
				<span className="font-mono text-[9px] font-bold tracking-wider leading-none opacity-90">
					{driver.Tla}
				</span>
			</div>
		</div>
	);
}

/**
 * Banderas Rectangulares Puras 3:2 Oficiales sin mástil (Opción B)
 * - Proporción limpia 3:2 (27px × 18px)
 * - Bordes suavemente redondeados (rounded-[3px])
 * - Acabado vectorial nítido de alta precisión
 */
function PureRaceFlag({ flag }: { flag: string }) {
	const normalized = flag.toUpperCase().trim();

	if (normalized === "CLEAR") return null;

	return (
		<div className="flex items-center justify-center shrink-0" title={`Bandera ${normalized}`}>
			{normalized === "YELLOW" && (
				<div
					title="Bandera Amarilla"
					className="w-[27px] h-[18px] rounded-[3px] bg-yellow-400 border border-yellow-200/50 shadow-sm shadow-yellow-500/20"
				/>
			)}

			{normalized === "DOUBLE YELLOW" && (
				<div
					title="Doble Bandera Amarilla"
					className="w-[27px] h-[18px] rounded-[3px] overflow-hidden border border-yellow-200/50 flex gap-[1.5px] p-[1px] bg-black/60 shadow-sm shadow-yellow-500/20"
				>
					<div className="flex-1 bg-yellow-400 rounded-[1px]" />
					<div className="flex-1 bg-yellow-400 rounded-[1px]" />
				</div>
			)}

			{normalized === "RED" && (
				<div
					title="Bandera Roja"
					className="w-[27px] h-[18px] rounded-[3px] bg-red-600 border border-red-400/50 shadow-sm shadow-red-500/25"
				/>
			)}

			{normalized === "GREEN" && (
				<div
					title="Bandera Verde"
					className="w-[27px] h-[18px] rounded-[3px] bg-emerald-500 border border-emerald-300/50 shadow-sm shadow-emerald-500/20"
				/>
			)}

			{normalized === "BLUE" && (
				<div
					title="Bandera Azul"
					className="w-[27px] h-[18px] rounded-[3px] bg-blue-500 border border-blue-300/50 shadow-sm shadow-blue-500/20"
				/>
			)}

			{normalized === "BLACK AND WHITE" && (
				<div
					title="Bandera Blanca y Negra (Límites de pista / Advertencia)"
					className="w-[27px] h-[18px] rounded-[3px] overflow-hidden border border-white/40 shadow-sm relative bg-white"
				>
					<svg className="w-full h-full block" viewBox="0 0 27 18" preserveAspectRatio="none">
						<polygon points="0,18 27,0 27,18" fill="#18181b" />
					</svg>
				</div>
			)}

			{normalized === "CHEQUERED" && (
				<div
					title="Bandera a Cuadros"
					className="w-[27px] h-[18px] rounded-[3px] overflow-hidden border border-white/40 shadow-sm bg-white"
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
