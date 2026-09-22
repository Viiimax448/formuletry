"use client";

import { motion } from "motion/react";
import clsx from "clsx";

import type { Driver } from "@/types/state.type";
import { getCustomTeamColor, getContrastColor } from "@/lib/teamColors";

type Props = {
	driver: Driver;
	driverViolations: number;
};

export default function DriverViolations({ driver, driverViolations }: Props) {
	const teamColor = getCustomTeamColor(driver.TeamColour, driver.Tla);
	const textColor = getContrastColor(teamColor);
	const isDarkText = textColor === "#090d16";
	const dividerBorder = isDarkText ? "border-black/15" : "border-white/20";
	const outerBorder = isDarkText ? "border-black/20" : "border-white/20";

	return (
		<motion.div
			layout="position"
			animate={{ opacity: 1, y: 0, scale: 1 }}
			initial={{ opacity: 0, y: 4, scale: 0.98 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.15 }}
			className="group relative rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] border-l-2 border-l-amber-500/80 px-2.5 py-2 transition-colors duration-150"
		>
			<div className="flex items-center justify-between gap-2.5">
				{/* Left: Driver Badge & Info */}
				<div className="flex items-center gap-2.5 min-w-0">
					{/* Driver Block (matching Option B) */}
					<div
						className={clsx(
							"flex flex-col items-stretch justify-center rounded-md overflow-hidden border shadow-sm min-w-[34px] w-[34px] shrink-0 select-none",
							outerBorder,
						)}
						style={{ backgroundColor: teamColor, color: textColor }}
						title={`${driver.BroadcastName} (#${driver.RacingNumber})`}
					>
						<div className="flex items-center justify-center pt-0.5 pb-0.2 px-0.5 leading-none font-mono font-black text-xs tabular-nums">
							{driver.RacingNumber}
						</div>
						<div className={clsx("flex items-center justify-center pt-0.2 pb-0.5 px-0.5 border-t", dividerBorder)}>
							<span className="font-mono text-[9px] font-bold tracking-wider leading-none opacity-90">
								{driver.Tla}
							</span>
						</div>
					</div>

					{/* Driver Name & Team */}
					<div className="flex flex-col min-w-0">
						<span className="truncate text-xs font-semibold text-gray-200 font-sans">
							{driver.BroadcastName ?? driver.FullName}
						</span>
						<span className="text-[10px] font-medium text-gray-400 truncate">
							{driver.TeamName}
						</span>
					</div>
				</div>

				{/* Right: Infraction Count Badge */}
				<div className="flex items-center gap-2 shrink-0">
					<div className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-200 font-mono text-xs font-bold shadow-xs">
						<span className="text-amber-400 font-black">{driverViolations}</span>
						<span className="text-[10px] font-medium text-gray-400">
							{driverViolations === 1 ? "aviso" : "avisos"}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
