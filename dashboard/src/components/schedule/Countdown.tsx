"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { duration, now, utc } from "moment";

import type { Session } from "@/types/schedule.type";

type Props = {
	next: Session;
	type: "race" | "other";
};

export default function Countdown({ next, type }: Props) {
	const [[days, hours, minutes, seconds], setDuration] = useState<
		[number | null, number | null, number | null, number | null]
	>([null, null, null, null]);

	const nextMoment = utc(next.start);

	const requestRef = useRef<number | null>(null);

	useEffect(() => {
		const animateNextFrame = () => {
			const diff = duration(nextMoment.diff(now()));

			const days = parseInt(diff.asDays().toString());

			if (diff.asSeconds() > 0) {
				setDuration([days, diff.hours(), diff.minutes(), diff.seconds()]);
			} else {
				setDuration([0, 0, 0, 0]);
			}

			requestRef.current = requestAnimationFrame(animateNextFrame);
		};

		requestRef.current = requestAnimationFrame(animateNextFrame);
		return () => (requestRef.current ? cancelAnimationFrame(requestRef.current) : void 0);
	}, [nextMoment]);

	return (
		<div>
			<p className="mb-6 text-lg font-medium font-sans text-gray-300">
				Next {type === "race" ? "race" : "session"} in
			</p>

			<AnimatePresence>
				<div className="grid auto-cols-max grid-flow-col gap-6 text-center">
					<div className="flex flex-col items-center">
						{days != undefined && days != null ? (
							<motion.p
								className="text-5xl font-bold font-mono text-white lg:text-6xl"
								key={days}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{String(days).padStart(2, '0')}
							</motion.p>
						) : (
							<div className="h-14 w-20 animate-pulse rounded-lg bg-white/10 lg:h-16 lg:w-24" />
						)}
						<p className="mt-2 text-sm font-medium font-sans uppercase tracking-wide text-gray-400">Days</p>
					</div>

					<div className="flex flex-col items-center">
						{hours != undefined && hours != null ? (
							<motion.p
								className="text-5xl font-bold font-mono text-white lg:text-6xl"
								key={hours}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{String(hours).padStart(2, '0')}
							</motion.p>
						) : (
							<div className="h-14 w-20 animate-pulse rounded-lg bg-white/10 lg:h-16 lg:w-24" />
						)}
						<p className="mt-2 text-sm font-medium font-sans uppercase tracking-wide text-gray-400">Hours</p>
					</div>

					<div className="flex flex-col items-center">
						{minutes != undefined && minutes != null ? (
							<motion.p
								className="text-5xl font-bold font-mono text-white lg:text-6xl"
								key={minutes}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{String(minutes).padStart(2, '0')}
							</motion.p>
						) : (
							<div className="h-14 w-20 animate-pulse rounded-lg bg-white/10 lg:h-16 lg:w-24" />
						)}
						<p className="mt-2 text-sm font-medium font-sans uppercase tracking-wide text-gray-400">Minutes</p>
					</div>

					<div className="flex flex-col items-center">
						{seconds != undefined && seconds != null ? (
							<motion.p
								className="text-5xl font-bold font-mono text-blue-400 lg:text-6xl"
								key={seconds}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{String(seconds).padStart(2, '0')}
							</motion.p>
						) : (
							<div className="h-14 w-20 animate-pulse rounded-lg bg-white/10 lg:h-16 lg:w-24" />
						)}
						<p className="mt-2 text-sm font-medium font-sans uppercase tracking-wide text-gray-400">Seconds</p>
					</div>
				</div>
			</AnimatePresence>
		</div>
	);
}
