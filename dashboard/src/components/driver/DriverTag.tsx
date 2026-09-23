import clsx from "clsx";
import { getCustomTeamColor, getDarkerTeamColor, getContrastColor } from "@/lib/teamColors";

type Props = {
	teamColor: string;
	short: string;
	position?: number;
	className?: string;
	showIcon?: boolean;
	onOpenDriverCard?: () => void;
};

export default function DriverTag({ position, teamColor, short, className, showIcon = true, onOpenDriverCard }: Props) {
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
			title="Abrir DriverCard"
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
				className="flex items-center gap-1.5 px-2 rounded-r h-7 transition-colors group-hover/tag:brightness-125"
				style={{ 
					backgroundColor: nameBgColor, 
					color: nameTextColor,
				}}
			>
				<span className="font-mono text-[13px] font-bold leading-none tracking-tight select-none">
					{short}
				</span>
				{showIcon && (
					<svg 
						viewBox="0 0 24 24" 
						fill="none" 
						stroke="currentColor" 
						strokeWidth="2" 
						strokeLinecap="round" 
						strokeLinejoin="round" 
						className="w-3.5 h-3.5 shrink-0 transition-transform group-hover/tag:scale-110"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="7.5" x2="12" y2="16.5" />
						<line x1="7.5" y1="12" x2="16.5" y2="12" />
					</svg>
				)}
			</div>
		</div>
	);
}
