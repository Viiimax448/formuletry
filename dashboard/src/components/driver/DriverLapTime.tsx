import clsx from "clsx";

import type { TimingDataDriver } from "@/types/state.type";

type Props = {
	last: TimingDataDriver["LastLapTime"];
	best: TimingDataDriver["BestLapTime"];
	hasFastest: boolean;
};

export default function DriverLapTime({ last, best, hasFastest }: Props) {
	// Sanitize lap time data to normalize API inconsistencies
	const sanitizeLapTime = (value: string | undefined) => {
		if (!value) return "-- -- -";
		// Convert "-- -- -- -" to "-- -- -" for consistent formatting
		return value.replace(/^-- -- -- -$/, "-- -- -");
	};

	const lastValue = sanitizeLapTime(last.Value);
	const bestValue = sanitizeLapTime(best.Value);

	return (
		<div className="place-self-start">
			<p
				className={clsx(
					"text-xs leading-tight font-medium font-mono tabular-nums",
					{
						"text-violet-600!": last.OverallFastest,
						"text-emerald-500!": last.PersonalFastest,
						"text-zinc-500!": !last.Value,
					}
				)}
			>
				{lastValue}
			</p>
			<p
				className={clsx(
					"text-[10px] leading-tight text-zinc-500 font-mono tabular-nums",
					{
						"text-violet-600!": hasFastest,
						"text-zinc-500!": !best.Value,
					}
				)}
			>
				{bestValue}
			</p>
		</div>
	);
}
