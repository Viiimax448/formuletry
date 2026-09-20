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
		<div className="place-self-start flex flex-col justify-center">
			<p
				className={clsx(
					"text-[10.5px] leading-none font-bold font-mono tabular-nums",
					{
						"text-violet-400!": last.OverallFastest,
						"text-emerald-400!": last.PersonalFastest,
						"text-zinc-500!": !last.Value,
					}
				)}
			>
				{lastValue}
			</p>
			<p
				className={clsx(
					"text-[8.5px] leading-none text-zinc-400 font-mono tabular-nums mt-0.5",
					{
						"text-violet-400!": hasFastest,
						"text-zinc-500!": !best.Value,
					}
				)}
			>
				{bestValue}
			</p>
		</div>
	);
}
