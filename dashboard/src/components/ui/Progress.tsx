"use client";

import { motion } from "motion/react";
import clsx from "clsx";

type Props = {
	duration: number;
	progress: number;
	className?: string;
	accent?: string;
};

export default function Progress({ duration, progress, className, accent }: Props) {
	const percent = progress / duration;

	return (
		<div className={clsx("h-2 w-full max-w-60 overflow-hidden rounded-xl bg-white/50", className)}>
			<motion.div
				className="h-full"
				style={{ 
					width: `${percent * 100}%`,
					backgroundColor: accent || "#ffffff"
				}}
				animate={{ transitionDuration: "0.1s" }}
				layout
			/>
		</div>
	);
}
