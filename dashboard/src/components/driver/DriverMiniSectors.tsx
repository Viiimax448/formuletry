import clsx from "clsx";
import { useState, useEffect } from "react";

import type { TimingDataDriver, TimingStatsDriver } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	sectors: TimingDataDriver["Sectors"];
	bestSectors: TimingStatsDriver["BestSectors"] | undefined;
	className?: string; // Added className to Props
};

export default function DriverMiniSectors({ sectors = [], bestSectors }: Props) {
	const showMiniSectors = useSettingsStore((state) => state.showMiniSectors);
	const showBestSectors = useSettingsStore((state) => state.showBestSectors);
	
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const getPlaceholder = () => isMobile ? "--" : "-- --";

	return (
		<div className="flex gap-1">
			{sectors.map((sector, i) => (
				<div key={`sector.${i}`} className="flex flex-col gap-0.5">
					{showMiniSectors && (
						<div className="flex flex-row gap-0.5">
							{sector.Segments.map((segment, j) => (
								<MiniSector status={segment.Status} key={`sector.mini.${j}`} />
							))}
						</div>
					)}

					<div className={clsx("flex", showMiniSectors ? "items-center gap-1" : "flex-col")}>
						<p
							className={clsx(
								"text-xs leading-tight font-medium tabular-nums",
								{
									"text-violet-600!": sector.OverallFastest,
									"text-emerald-500!": sector.PersonalFastest,
									"text-zinc-500": !sector.Value,
								}
							)}
						>
							{!!sector.Value ? sector.Value : !!sector.PreviousValue ? sector.PreviousValue : getPlaceholder()}
						</p>

						{showBestSectors && (
							<p
								className={clsx(
									"text-[10px] leading-tight text-zinc-500 tabular-nums",
									{
										"text-violet-600!": bestSectors?.[i].Position === 1,
									}
								)}
							>
								{bestSectors && bestSectors[i].Value ? bestSectors[i].Value : getPlaceholder()}
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

function MiniSector({ status }: { status: number }) {
	return (
		<div
			className={clsx(
				"w-2 h-1 rounded-sm",
				{
					"bg-amber-400": status === 2048 || status === 2052, // TODO unsure
					"bg-emerald-500": status === 2049,
					"bg-violet-600": status === 2051,
					"bg-blue-500": status === 2064,
					"bg-zinc-700": status === 0,
				}
			)}
		/>
	);
}
