import clsx from "clsx";
import { BarChart2 } from "lucide-react";
import { getCustomTeamColor, getDarkerTeamColor, getContrastColor } from "@/lib/teamColors";

type Props = {
	teamColor: string;
	short: string;
	position?: number;
	className?: string;
	onOpenDriverCard?: () => void;
};

export default function DriverTag({ position, teamColor, short, className, onOpenDriverCard }: Props) {
	const posBgColor = getCustomTeamColor(teamColor, short);
	const nameBgColor = getDarkerTeamColor(teamColor, short);

	const posTextColor = getContrastColor(posBgColor);
	const nameTextColor = getContrastColor(nameBgColor);

	return (
		<div
			id="walkthrough-driver-position"
			onClick={(e) => {
				if (onOpenDriverCard) {
					e.stopPropagation();
					onOpenDriverCard();
				}
			}}
			title="Ver telemetría y estadísticas"
			className={clsx(
				"flex w-fit items-center cursor-pointer group/tag transition-transform active:scale-95",
				className,
			)}
		>
			{position && (
				<div 
					className="flex items-center justify-center w-7 h-7 rounded-l font-mono font-bold text-xs shrink-0"
					style={{ 
						backgroundColor: posBgColor, 
						color: posTextColor,
					}}
				>
					{position}
				</div>
			)}
			<div 
				className="flex items-center gap-1.5 px-2 py-0.5 rounded-r h-7 transition-colors group-hover/tag:brightness-125"
				style={{ 
					backgroundColor: nameBgColor, 
					color: nameTextColor,
				}}
			>
				<p className="font-mono text-[13px] font-bold leading-none tracking-tight">
					{short}
				</p>
				<BarChart2 
					className="w-3.5 h-3.5 transition-opacity" 
					style={{ opacity: nameTextColor === "#ffffff" ? 0.7 : 0.85 }}
				/>
			</div>
		</div>
	);
}
