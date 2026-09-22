import clsx from "clsx";
import { useSettingsStore } from "@/stores/useSettingsStore";

import type { CarDataChannels } from "@/types/state.type";

import DriverPedals from "./DriverPedals";

type Props = {
	carData: CarDataChannels;
	className?: string; // Added className to Props
};

function convertKmhToMph(kmhValue: number) {
	return Math.floor(kmhValue / 1.609344);
}

export default function DriverCarMetrics({ carData, className }: Props) {
	const speedUnit = useSettingsStore((state) => state.speedUnit);

	return (
		<div className={clsx("flex items-center gap-2 place-self-start", className)}>
			<p className="flex h-6.5 w-6.5 items-center justify-center font-mono text-xs font-bold bg-zinc-800/80 rounded border border-zinc-700/50">{carData[3]}</p>

			<div className="text-right">
				<p className="font-mono text-xs font-bold leading-none">
					{speedUnit === "metric" ? carData[2] : convertKmhToMph(carData[2])}
				</p>
				<p className="text-[9px] leading-none text-zinc-500 mt-0.5">{speedUnit === "metric" ? "km/h" : "mph"}</p>
			</div>

			<div className="flex flex-col">
				<div className="flex flex-col gap-0.5">
					<DriverPedals className="bg-red-500" value={carData[5]} maxValue={1} />
					<DriverPedals className="bg-emerald-500" value={carData[4]} maxValue={100} />
					<DriverPedals className="bg-blue-500" value={carData[0]} maxValue={15000} />
				</div>
			</div>
		</div>
	);
}
