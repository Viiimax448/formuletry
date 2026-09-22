import clsx from "clsx";

import type { TimingDataDriver } from "@/types/state.type";

type Props = {
	timingDriver: TimingDataDriver;
	sessionPart: number | undefined;
};

export default function DriverGap({ timingDriver, sessionPart }: Props) {
	const gapToLeader =
		timingDriver.GapToLeader ??
		(timingDriver.Stats ? timingDriver.Stats[sessionPart ? sessionPart - 1 : 0].TimeDiffToFastest : undefined) ??
		timingDriver.TimeDiffToFastest ??
		"";

	const gapToFront =
		timingDriver.IntervalToPositionAhead?.Value ??
		(timingDriver.Stats ? timingDriver.Stats[sessionPart ? sessionPart - 1 : 0].TimeDifftoPositionAhead : undefined) ??
		timingDriver.TimeDiffToPositionAhead ??
		"";

	const catching = timingDriver.IntervalToPositionAhead?.Catching;

	return (
		<div className="place-self-start flex flex-col justify-center">
			<p
				className={clsx(
					"text-[13px] leading-none font-bold font-mono tabular-nums",
					{
						"text-emerald-400": catching,
						"text-zinc-500": !gapToFront,
					}
				)}
			>
				{!!gapToFront ? gapToFront : "-- ---"}
			</p>

			<p className="text-[10px] leading-none text-zinc-400 font-mono tabular-nums mt-0.5">
				{gapToLeader ? gapToLeader : "-- -- ---"}
			</p>
		</div>
	);
}
