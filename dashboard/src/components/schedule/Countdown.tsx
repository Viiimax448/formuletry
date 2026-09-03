"use client";

import { motion } from "motion/react";
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
			const d = parseInt(diff.asDays().toString());

			if (diff.asSeconds() > 0) {
				setDuration([d, diff.hours(), diff.minutes(), diff.seconds()]);
			} else {
				setDuration([0, 0, 0, 0]);
			}

			requestRef.current = requestAnimationFrame(animateNextFrame);
		};

		requestRef.current = requestAnimationFrame(animateNextFrame);
		return () => (requestRef.current ? cancelAnimationFrame(requestRef.current) : void 0);
	}, [nextMoment]);

	const items = [
		{ label: "DAYS", val: days, isCyan: false },
		{ label: "HOURS", val: hours, isCyan: false },
		{ label: "MINS", val: minutes, isCyan: false },
		{ label: "SECS", val: seconds, isCyan: true },
	];

	return (
		<div>
			<div className="flex items-center gap-2 mb-3">
				<span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
				<p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">
					Countdown to {type === "race" ? "Grand Prix Race" : next.kind}
				</p>
			</div>

			<div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
				{items.map((item) => (
					<div
						key={item.label}
						className="rounded-xl bg-neutral-950/90 border border-neutral-800/90 p-2.5 sm:p-3.5 flex flex-col items-center justify-center shadow-inner"
					>
						{item.val !== null ? (
							<motion.p
								key={item.val}
								initial={{ y: -6, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								className={`text-xl sm:text-2xl md:text-3xl font-extrabold font-mono ${
									item.isCyan
										? "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
										: "text-white"
								}`}
							>
								{String(item.val).padStart(2, "0")}
							</motion.p>
						) : (
							<div className="h-7 sm:h-9 w-10 sm:w-12 animate-pulse rounded bg-neutral-900" />
						)}
						<span className="mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-500">
							{item.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
