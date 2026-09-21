"use client";

import { motion } from "motion/react";
import { utc } from "moment";
import Image from "next/image";
import clsx from "clsx";

import type { Message, Driver } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";
import { toTrackTime } from "@/lib/toTrackTime";

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
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1 min-w-0">
					{/* Top Header Row: Lap + Times + Driver Tag */}
					<div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
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

						{/* Driver Chip if car is found */}
						{driver && (
							<div className="ml-auto flex items-center gap-1">
								<span
									className="rounded px-1.5 py-0.2 text-[9px] font-bold text-white shadow-sm flex items-center gap-0.5"
									style={{ backgroundColor: `#${driver.TeamColour}` }}
								>
									<span>#{driver.RacingNumber}</span>
									<span>{driver.Tla}</span>
								</span>
							</div>
						)}
					</div>

					{/* Message Content */}
					<p className="font-sans text-xs leading-snug text-gray-200 font-medium">
						{msg.Message}
					</p>
				</div>

				{/* Flag SVG badge if flag present */}
				{msg.Flag && msg.Flag !== "CLEAR" && (
					<div className="flex flex-col items-center shrink-0 pt-0.5">
						<Image
							src={`/flags/${msg.Flag.toLowerCase().replaceAll(" ", "-")}-flag.svg`}
							alt={msg.Flag}
							width={18}
							height={18}
							className="rounded border border-white/10"
						/>
					</div>
				)}
			</div>
		</motion.li>
	);
}
