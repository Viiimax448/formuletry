"use client";

import { useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { ShieldCheck, AlertCircle } from "lucide-react";

import type { Driver } from "@/types/state.type";
import { useDataStore } from "@/stores/useDataStore";
import DriverViolations from "./DriverViolations";

type Violations = {
	[key: string]: number;
};

const findCarNumber = (message: string): string | undefined => {
	const match = message.match(/CAR (\d+)/i);
	return match?.[1];
};

const sortViolations = (driverA: Driver, driverB: Driver, violations: Violations): number => {
	const a = violations[driverA.RacingNumber] ?? 0;
	const b = violations[driverB.RacingNumber] ?? 0;
	return b - a;
};

export default function TrackViolations() {
	const messages = useDataStore((state) => state.state?.RaceControlMessages);
	const drivers = useDataStore((state) => state.state?.DriverList);

	const trackLimits: Violations = useMemo(() => {
		if (!messages?.Messages) return {};

		return messages.Messages.filter((rcm) => {
			const upper = rcm.Message.toUpperCase();
			return upper.includes("TRACK LIMITS") || upper.includes("OFF TRACK") || upper.includes("LEAVING THE TRACK");
		}).reduce((acc: Violations, violations) => {
			const carNr = findCarNumber(violations.Message);
			if (!carNr) return acc;

			acc[carNr] = (acc[carNr] || 0) + 1;
			return acc;
		}, {});
	}, [messages]);

	const violationDrivers = useMemo(() => {
		if (!drivers) return [];
		return Object.values(drivers)
			.filter((driver) => (trackLimits[driver.RacingNumber] ?? 0) > 0)
			.sort((a, b) => sortViolations(a, b, trackLimits));
	}, [drivers, trackLimits]);

	const totalViolations = Object.values(trackLimits).reduce((sum, v) => sum + v, 0);

	return (
		<div className="flex h-full w-full flex-col">
			{/* Panel Header */}
			<div className="flex flex-col gap-2 pb-3 border-b border-gray-800/80 mb-3">
				<div className="flex items-center justify-between">
					{/* Title + Count */}
					<div className="flex items-center gap-2">
						<h2 className="text-sm font-semibold tracking-wide text-white uppercase font-sans flex items-center gap-1.5">
							<span>Track Violations</span>
						</h2>
						<span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono font-bold text-gray-300">
							{totalViolations}
						</span>
					</div>

					{/* Status Pill Badge */}
					{violationDrivers.length > 0 ? (
						<div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/60 text-amber-400 text-[10px] font-mono font-semibold">
							<AlertCircle className="w-3 h-3 text-amber-400" />
							<span>{violationDrivers.length} Piloto{violationDrivers.length > 1 ? "s" : ""}</span>
						</div>
					) : (
						<div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-500/60 text-emerald-400 text-[10px] font-mono font-semibold">
							<ShieldCheck className="w-3 h-3 text-emerald-400" />
							<span>Pista Limpia</span>
						</div>
					)}
				</div>
			</div>

			{/* Driver Violations List */}
			<div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
				{violationDrivers.length < 1 ? (
					<div className="flex flex-col items-center justify-center py-14 text-center">
						<div className="rounded-full border border-emerald-500/40 p-3 mb-2.5">
							<ShieldCheck className="h-6 w-6 text-emerald-400" />
						</div>
						<p className="text-xs font-semibold text-gray-200 uppercase tracking-wide font-mono">
							Pista Limpia
						</p>
						<p className="text-[11px] text-gray-400 mt-1 max-w-[220px]">
							No hay avisos de límites de pista registrados en la sesión.
						</p>
					</div>
				) : (
					<AnimatePresence mode="popLayout">
						{violationDrivers.map((driver) => (
							<DriverViolations
								key={`violation.driver.${driver.RacingNumber}`}
								driver={driver}
								driverViolations={trackLimits[driver.RacingNumber] ?? 0}
							/>
						))}
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}
