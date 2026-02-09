import { AnimatePresence } from "motion/react";
import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";

import { sortUtc } from "@/lib/sorting";

import RadioMessage from "@/components/dashboard/RadioMessage";

export default function TeamRadios() {
	const drivers = useDataStore((state) => state.state?.DriverList);
	const teamRadios = useDataStore((state) => state.state?.TeamRadio);
	const sessionPath = useDataStore((state) => state.state?.SessionInfo?.Path);

	const gmtOffset = useDataStore((state) => state.state?.SessionInfo?.GmtOffset);

	const basePath = `https://livetiming.formula1.com/static/${sessionPath}`;

	// TODO add notice that we only show 20

	return (
		<div className="space-y-3">
			{!teamRadios && new Array(6).fill("").map((_, index) => <SkeletonMessage key={`radio.loading.${index}`} />)}

			{teamRadios && gmtOffset && drivers && teamRadios.Captures && (
				<AnimatePresence>
					{teamRadios.Captures.sort(sortUtc)
						.slice(0, 20)
						.map((teamRadio, i) => (
							<RadioMessage
								key={`radio.${i}`}
								driver={drivers[teamRadio.RacingNumber]}
								capture={teamRadio}
								basePath={basePath}
								gmtOffset={gmtOffset}
							/>
						))}
				</AnimatePresence>
			)}
		</div>
	);
}

const SkeletonMessage = () => {
	const animateClass = "animate-pulse rounded-md bg-white/10";

	return (
		<div className="rounded-xl border border-white/10 bg-white/5 p-4">
			<div className="mb-3 flex items-center gap-2">
				<div className={clsx(animateClass, "h-3 w-16")} />
				<div className={clsx(animateClass, "h-3 w-12")} />
			</div>

			<div className="flex items-center gap-4">
				<div className={clsx(animateClass, "h-7 w-12 rounded-full")} />
				<div className={clsx(animateClass, "h-6 w-6 rounded-full")} />
				<div className={clsx(animateClass, "h-1 flex-1")} />
			</div>
		</div>
	);
};
