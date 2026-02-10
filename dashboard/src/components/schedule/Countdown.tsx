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
			<p className="mb-4 text-base sm:text-lg font-medium font-sans text-gray-300">
				Next {type === "race" ? "race" : "session"} in
			</p>

			<AnimatePresence>
				<div className="grid auto-cols-max grid-flow-col gap-2 sm:gap-4 md:gap-6 text-center">
					<div className="flex flex-col items-center">
						{days != undefined && days != null ? (
							<motion.p
								className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-white"
								key={days}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{String(days).padStart(2, '0')}
							</motion.p>
						) : (
							<div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 md:h-14 md:w-20 lg:h-16 lg:w-24 animate-pulse rounded-lg bg-white/10" />
						)}
						<p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium font-sans uppercase tracking-wide text-gray-400">Days</p>
					</div>

					<div className="flex flex-col items-center">
						{hours != undefined && hours != null ? (
							<motion.p
								className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-white"
								key={hours}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{String(hours).padStart(2, '0')}
							</motion.p>
						) : (
							<div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 md:h-14 md:w-20 lg:h-16 lg:w-24 animate-pulse rounded-lg bg-white/10" />
						)}
						<p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium font-sans uppercase tracking-wide text-gray-400">Hours</p>
					</div>

					<div className="flex flex-col items-center">
						{minutes != undefined && minutes != null ? (
							<motion.p
								className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-white"
								key={minutes}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{String(minutes).padStart(2, '0')}
							</motion.p>
						) : (
							<div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 md:h-14 md:w-20 lg:h-16 lg:w-24 animate-pulse rounded-lg bg-white/10" />
						)}
						<p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium font-sans uppercase tracking-wide text-gray-400">Minutes</p>
					</div>

					<div className="flex flex-col items-center">
						{seconds != undefined && seconds != null ? (
							<motion.p
								className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-blue-400"
								key={seconds}
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: 10, opacity: 0 }}
							>
								{String(seconds).padStart(2, '0')}
							</motion.p>
						) : (
							<div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 md:h-14 md:w-20 lg:h-16 lg:w-24 animate-pulse rounded-lg bg-white/10" />
						)}
						<p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium font-sans uppercase tracking-wide text-gray-400">Seconds</p>
					</div>
				</div>
			</AnimatePresence>
		</div>
	);
}
