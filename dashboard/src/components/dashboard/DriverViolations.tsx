import type { Driver, TimingData } from "@/types/state.type";

import { calculatePosition } from "@/lib/calculatePosition";

import DriverTag from "@/components/driver/DriverTag";

type Props = {
	driver: Driver;
	driverViolations: number;
	driversTiming: TimingData | undefined;
};

export default function DriverViolations({ driver, driverViolations, driversTiming }: Props) {
	return (
		<div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10" key={`violation.${driver.RacingNumber}`}>
			<div className="flex items-center gap-3">
				{/* Compact Driver Badge */}
				<div
					className="rounded-full px-2.5 py-1 text-xs font-mono font-semibold text-white"
					style={{ backgroundColor: `#${driver.TeamColour}` }}
				>
					{driver.Tla}
				</div>

				{/* Violation Info */}
				<div className="flex flex-col gap-1">
					<p className="font-sans text-sm font-medium text-white">
						{driverViolations} Violation{driverViolations > 1 ? "s" : ""}
						{driverViolations > 4 && (
							<span className="ml-1 text-xs text-red-400">
								- {Math.round(driverViolations / 5) * 5}s Penalty
							</span>
						)}
					</p>
					{driverViolations > 4 && driversTiming && (
						<p className="text-xs font-mono text-gray-400">
							{calculatePosition(Math.round(driverViolations / 5) * 5, driver.RacingNumber, driversTiming)}
							th after penalty
						</p>
					)}
				</div>
			</div>

			{/* Violation Count Badge */}
			<div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-sm font-bold text-red-400">
				{driverViolations}
			</div>
		</div>
	);
}
