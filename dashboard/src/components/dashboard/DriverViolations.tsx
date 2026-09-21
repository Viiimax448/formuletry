"use client";

import { motion } from "motion/react";
import { AlertTriangle, ShieldAlert, ArrowDown } from "lucide-react";
import clsx from "clsx";

import type { Driver, TimingData } from "@/types/state.type";
import { calculatePosition } from "@/lib/calculatePosition";

type Props = {
	driver: Driver;
	driverViolations: number;
	driversTiming?: TimingData;
};

export default function DriverViolations({ driver, driverViolations, driversTiming }: Props) {
	const teamColor = `#${driver.TeamColour}`;
	
	// F1 Rule: 1-3 warnings (3rd = B&W Flag), 4th = 5s penalty, 5th+ = 10s or cumulative
	const penaltySeconds = driverViolations >= 5 ? 10 : driverViolations >= 4 ? 5 : 0;
	
	const currentPos = driversTiming?.Lines?.[driver.RacingNumber]?.Position
		? parseInt(driversTiming.Lines[driver.RacingNumber].Position)
		: null;

	const projectedPos =
		penaltySeconds > 0 && driversTiming
			? calculatePosition(penaltySeconds, driver.RacingNumber, driversTiming)
			: null;

	const isPenalized = driverViolations >= 4;
	const isAtRisk = driverViolations === 3;

	return (
		<motion.div
			layout="position"
			animate={{ opacity: 1, y: 0, scale: 1 }}
			initial={{ opacity: 0, y: 4, scale: 0.98 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className={clsx(
				"group relative rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] border-l-2 px-2.5 py-2 transition-colors duration-150",
				{
					"border-l-red-500": isPenalized,
					"border-l-amber-500": isAtRisk,
					"border-l-gray-700": !isPenalized && !isAtRisk,
				},
			)}
		>
			<div className="flex items-center justify-between gap-2">
				{/* Left: Driver Tag & Name */}
				<div className="flex items-center gap-2 min-w-0">
					<div
						className="rounded px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-sm flex items-center gap-0.5 shrink-0"
						style={{ backgroundColor: teamColor }}
					>
						<span>#{driver.RacingNumber}</span>
						<span>{driver.Tla}</span>
					</div>

					<div className="flex flex-col min-w-0">
						<span className="truncate text-xs font-semibold text-gray-200 font-sans">
							{driver.BroadcastName ?? driver.FullName}
						</span>
						<span className="text-[9px] font-medium text-gray-400 truncate">
							{driver.TeamName}
						</span>
					</div>
				</div>

				{/* Right: Violation Count Badge & Penalty Tag */}
				<div className="flex items-center gap-1.5 shrink-0">
					{isPenalized ? (
						<div className="flex items-center gap-0.5 px-1.5 py-0.2 rounded border border-red-500/40 text-red-400 text-[10px] font-mono font-bold">
							<ShieldAlert className="w-2.5 h-2.5" />
							<span>+{penaltySeconds}s</span>
						</div>
					) : isAtRisk ? (
						<div className="flex items-center gap-0.5 px-1.5 py-0.2 rounded border border-amber-500/40 text-amber-400 text-[10px] font-mono font-semibold">
							<AlertTriangle className="w-2.5 h-2.5" />
							<span>B&amp;W</span>
						</div>
					) : (
						<span className="text-[11px] font-mono font-medium text-gray-400">
							{driverViolations}/4
						</span>
					)}

					<div
						className={clsx(
							"flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-mono font-bold",
							isPenalized
								? "border border-red-500 text-red-400"
								: isAtRisk
									? "border border-amber-500 text-amber-400"
									: "border border-white/10 text-gray-300",
						)}
					>
						{driverViolations}
					</div>
				</div>
			</div>

			{/* F1 4-Strike Visual Gauge Bar */}
			<div className="mt-1.5 flex items-center gap-1.5 pt-1.5 border-t border-white/5">
				<div className="flex flex-1 items-center gap-1">
					{/* Strike 1 */}
					<div
						className={clsx(
							"h-1 flex-1 rounded-full transition-all",
							driverViolations >= 1 ? "bg-emerald-500" : "bg-gray-800",
						)}
						title="Strike 1: 1ª Advertencia"
					/>
					{/* Strike 2 */}
					<div
						className={clsx(
							"h-1 flex-1 rounded-full transition-all",
							driverViolations >= 2 ? "bg-yellow-500" : "bg-gray-800",
						)}
						title="Strike 2: 2ª Advertencia"
					/>
					{/* Strike 3 (B&W Flag) */}
					<div
						className={clsx(
							"h-1 flex-1 rounded-full transition-all",
							driverViolations >= 3 ? "bg-amber-500" : "bg-gray-800",
						)}
						title="Strike 3: Bandera Blanco y Negro (Último aviso)"
					/>
					{/* Strike 4 (5s Penalty) */}
					<div
						className={clsx(
							"h-1 flex-1 rounded-full transition-all",
							driverViolations >= 4 ? "bg-red-500" : "bg-gray-800",
						)}
						title="Strike 4: 5 Segundos de Penalización"
					/>
				</div>

				{/* Projected Position Impact */}
				{isPenalized && currentPos !== null && projectedPos !== null && (
					<div className="flex items-center gap-0.5 text-[10px] font-mono text-red-400 ml-1.5">
						<ArrowDown className="w-2.5 h-2.5 text-red-400" />
						<span>
							P{currentPos} ➔ P{projectedPos}
						</span>
					</div>
				)}
			</div>
		</motion.div>
	);
}
