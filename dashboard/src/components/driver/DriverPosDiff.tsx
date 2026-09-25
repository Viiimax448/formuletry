import clsx from "clsx";

type Props = {
	gridPos?: string | number | null;
	position: number;
	className?: string;
};

export default function DriverPosDiff({ gridPos, position, className }: Props) {
	const parsedGrid = gridPos !== undefined && gridPos !== null && gridPos !== "" ? Number(gridPos) : null;
	const isValidGrid = parsedGrid !== null && !isNaN(parsedGrid) && parsedGrid > 0;
	const diff = isValidGrid ? parsedGrid - position : 0;

	const gain = diff > 0;
	const loss = diff < 0;

	return (
		<div
			className={clsx(
				"flex items-center justify-center w-5.5 shrink-0 select-none font-mono",
				className,
			)}
			title={
				gain
					? `Ganó ${diff} posición${diff > 1 ? "es" : ""} (Largó P${parsedGrid})`
					: loss
					? `Perdió ${Math.abs(diff)} posición${Math.abs(diff) > 1 ? "es" : ""} (Largó P${parsedGrid})`
					: isValidGrid
					? `Sin cambios de posición (Largó P${parsedGrid})`
					: undefined
			}
		>
			{gain && (
				<div className="flex items-center gap-0.5 text-emerald-400 font-bold text-[11px] leading-none tabular-nums">
					<svg
						viewBox="0 0 24 24"
						className="w-2.5 h-2.5 fill-emerald-400 shrink-0"
						aria-hidden="true"
					>
						<path d="M12 4L22 19H2L12 4Z" />
					</svg>
					<span>{diff}</span>
				</div>
			)}
			{loss && (
				<div className="flex items-center gap-0.5 text-red-500 font-bold text-[11px] leading-none tabular-nums">
					<svg
						viewBox="0 0 24 24"
						className="w-2.5 h-2.5 fill-red-500 shrink-0"
						aria-hidden="true"
					>
						<path d="M12 20L2 5H22L12 20Z" />
					</svg>
					<span>{Math.abs(diff)}</span>
				</div>
			)}
			{!gain && !loss && (
				<span className="text-zinc-500 font-bold text-xs leading-none select-none">
					=
				</span>
			)}
		</div>
	);
}
