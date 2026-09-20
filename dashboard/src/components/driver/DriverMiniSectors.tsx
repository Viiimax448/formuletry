import clsx from "clsx";

import type { TimingDataDriver, TimingStatsDriver } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	sectors: TimingDataDriver["Sectors"];
	bestSectors: TimingStatsDriver["BestSectors"] | undefined;
	className?: string;
};

export default function DriverMiniSectors({ sectors = [], bestSectors, className }: Props) {
	const showMiniSectors = useSettingsStore((state) => state.showMiniSectors);
	const showBestSectors = useSettingsStore((state) => state.showBestSectors);

	// Si no hay sectores o no hay ninguna data real en ellos, no renderizar nada para evitar altura extra
	if (!sectors || sectors.length === 0) {
		return null;
	}

	const hasAnyData = sectors.some(
		(s) => !!s.Value || !!s.PreviousValue || s.Segments?.some((seg) => seg.Status > 0),
	);

	if (!hasAnyData) {
		return null;
	}

	return (
		<div className={clsx("flex items-center gap-1", className)}>
			{sectors.map((sector, i) => {
				const hasSectorValue = !!sector.Value || !!sector.PreviousValue;
				const bestSectorValue = bestSectors && bestSectors[i]?.Value ? bestSectors[i].Value : null;
				const displayValue = sector.Value || sector.PreviousValue;

				// Si este sector individual no tiene ningún dato ni segmentos activos, no mostrar nada
				const hasSegmentData = sector.Segments?.some((seg) => seg.Status > 0);
				if (!hasSectorValue && !hasSegmentData) {
					return null;
				}

				return (
					<div key={`sector.${i}`} className="flex flex-col justify-center gap-0.5 whitespace-nowrap">
						{showMiniSectors && sector.Segments && sector.Segments.length > 0 && (
							<div className="flex flex-row gap-0.5 mb-0.5">
								{sector.Segments.map((segment, j) => (
									<MiniSector status={segment.Status} key={`sector.mini.${j}`} />
								))}
							</div>
						)}

						{displayValue && (
							<p
								className={clsx(
									"text-[9.5px] leading-none font-bold font-mono tabular-nums",
									{
										"text-violet-400!": sector.OverallFastest,
										"text-emerald-400!": sector.PersonalFastest,
										"text-zinc-400": !sector.Value,
									},
								)}
							>
								{displayValue}
							</p>
						)}
					</div>
				);
			})}
		</div>
	);
}

function MiniSector({ status }: { status: number }) {
	return (
		<div
			className={clsx("w-1.5 h-1 rounded-[1px]", {
				"bg-amber-400": status === 2048 || status === 2052,
				"bg-emerald-500": status === 2049,
				"bg-violet-600": status === 2051,
				"bg-blue-500": status === 2064,
				"bg-zinc-800": status === 0,
			})}
		/>
	);
}
