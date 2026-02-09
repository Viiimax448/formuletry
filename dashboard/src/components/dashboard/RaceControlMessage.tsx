import { motion } from "motion/react";
import { utc } from "moment";
import Image from "next/image";
import clsx from "clsx";

import type { Message } from "@/types/state.type";

import { useSettingsStore } from "@/stores/useSettingsStore";

import { toTrackTime } from "@/lib/toTrackTime";

type Props = {
	msg: Message;
	gmtOffset: string;
};

const getDriverNumber = (msg: Message) => {
	const match = msg.Message.match(/CAR (\d+)/);
	return match?.[1];
};

export function RaceControlMessage({ msg, gmtOffset }: Props) {
	const favoriteDriver = useSettingsStore((state) => state.favoriteDrivers.includes(getDriverNumber(msg) ?? ""));

	const localTime = utc(msg.Utc).local().format("HH:mm:ss");
	const trackTime = utc(toTrackTime(msg.Utc, gmtOffset)).format("HH:mm");

	const getMessageSeverity = (message: string) => {
		if (message.includes("PENALTY")) return "penalty";
		if (message.includes("INCIDENT") || message.includes("INVESTIGATION")) return "incident";
		if (message.includes("WARNING")) return "warning";
		return null;
	};

	const severity = getMessageSeverity(msg.Message);

	return (
		<motion.li
			layout="position"
			animate={{ opacity: 1, scale: 1 }}
			initial={{ opacity: 0, scale: 0.8 }}
			className={clsx(
				"relative rounded-lg border-l-4 bg-white/5 p-4 backdrop-blur-sm transition-colors", 
				{
					"border-l-red-500 bg-red-900/20": severity === "penalty",
					"border-l-yellow-500 bg-yellow-900/20": severity === "incident",
					"border-l-orange-500 bg-orange-900/20": severity === "warning",
					"border-l-blue-500 bg-blue-900/20": favoriteDriver && !severity,
					"border-l-gray-600": !favoriteDriver && !severity
				}
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1">
					<div className="mb-2 flex items-center gap-2 text-xs font-mono text-gray-400">
						{msg.Lap && (
							<span className="rounded-md bg-gray-700/50 px-2 py-1">Lap {msg.Lap}</span>
						)}
						<time dateTime={localTime} className="font-medium">
							{localTime}
						</time>
						<span className="text-gray-500">•</span>
						<time className="text-gray-500" dateTime={trackTime}>
							{trackTime}
						</time>
					</div>

					<p className="font-sans text-sm leading-relaxed text-white">{msg.Message}</p>
				</div>

				{msg.Flag && msg.Flag !== "CLEAR" && (
					<Image
						src={`/flags/${msg.Flag.toLowerCase().replaceAll(" ", "-")}-flag.svg`}
						alt={msg.Flag}
						width={28}
						height={28}
						className="flex-shrink-0 rounded shadow-sm"
					/>
				)}
			</div>
		</motion.li>
	);
}
