import { AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import clsx from "clsx";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";

import { sortUtc } from "@/lib/sorting";

import { RaceControlMessage } from "@/components/dashboard/RaceControlMessage";

export default function RaceControl() {
	const messages = useDataStore((state) => state.state?.RaceControlMessages?.Messages);
	const gmtOffset = useDataStore((state) => state.state?.SessionInfo?.GmtOffset);

	const raceControlChime = useSettingsStore((state) => state.raceControlChime);
	const raceControlChimeVolume = useSettingsStore((state) => state.raceControlChimeVolume);

	const chimeRef = useRef<HTMLAudioElement | null>(null);
	const pastMessageTimestamps = useRef<string[] | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const chime = new Audio("/sounds/chime.mp3");
			chime.volume = raceControlChimeVolume / 100;
			chimeRef.current = chime;

			return () => {
				chimeRef.current = null;
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;

		if (messages === undefined || messages === null) return;

		if (!pastMessageTimestamps.current) {
			pastMessageTimestamps.current = messages.map((msg) => msg.Utc);
			return;
		}

		const newMessages = messages.filter((msg) => !pastMessageTimestamps.current?.includes(msg.Utc));

		if (newMessages.length > 0 && raceControlChime) {
			chimeRef.current?.play();
		}

		pastMessageTimestamps.current = messages.map((msg) => msg.Utc);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	return (
		<div className="space-y-3">
			{!messages &&
				new Array(7).fill("").map((_, index) => <SkeletonMessage key={`msg.loading.${index}`} index={index} />)}

			{messages && gmtOffset && (
				<AnimatePresence>
					{messages
						.sort(sortUtc)
						.filter((msg) => (msg.Flag ? msg.Flag.toLowerCase() !== "blue" : true))
						.map((msg, i) => (
							<RaceControlMessage key={`msg.${i}`} msg={msg} gmtOffset={gmtOffset} />
						))}
				</AnimatePresence>
			)}
		</div>
	);
}

const SkeletonMessage = ({ index }: { index: number }) => {
	const animateClass = "animate-pulse rounded-md bg-white/10";

	const flag = index % 4 === 0;
	const long = index % 5 === 0;
	const mid = index % 3 === 0;

	return (
		<div className="rounded-lg border-l-4 border-l-gray-600 bg-white/5 p-4">
			<div className="mb-2 flex items-center gap-2">
				<div className={clsx(animateClass, "h-4 w-16")} />
				<div className={clsx(animateClass, "h-3 w-12")} />
			</div>

			<div className="flex gap-2">
				{flag && <div className={clsx(animateClass, "h-6 w-6")} />}
				<div className={clsx(animateClass, "h-4")} style={{ width: long ? "100%" : mid ? "75%" : "40%" }} />
			</div>
		</div>
	);
};
