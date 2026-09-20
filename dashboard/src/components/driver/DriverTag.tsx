import clsx from "clsx";
import { BarChart2 } from "lucide-react";

type Props = {
	teamColor: string;
	short: string;
	position?: number;
	className?: string;
	onOpenDriverCard?: () => void;
};

export default function DriverTag({ position, teamColor, short, className, onOpenDriverCard }: Props) {
	const getCustomTeamColor = (teamColor: string, driverTla: string) => {
		switch (driverTla) {
			case "BOR":
			case "HUL":
				return "#EA1B23"; // Rojo Audi Sport F1
			case "BOT":
			case "PER":
				return "#FFFFFF"; // Blanco Cadillac
			default:
				return teamColor.startsWith("#") ? teamColor : `#${teamColor}`;
		}
	};

	const getDarkerTeamColor = (teamColor: string, driverTla: string) => {
		const color = getCustomTeamColor(teamColor, driverTla);

		if (driverTla === "BOT" || driverTla === "PER") {
			return "#D1D5DB"; // Gris claro para Cadillac
		}

		if (color.startsWith("#")) {
			const hex = color.replace("#", "");
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);

			const darkenedR = Math.max(0, Math.floor(r * 0.65));
			const darkenedG = Math.max(0, Math.floor(g * 0.65));
			const darkenedB = Math.max(0, Math.floor(b * 0.65));

			return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
		}

		const rgb = color.replace(/rgb\(|\)/g, "").split(",").map(Number);
		const darkened = rgb.map((c) => Math.max(0, Math.floor(c * 0.65)));
		return `rgb(${darkened.join(", ")})`;
	};

	// Cálculo automático de contraste (fórmulas ITU-R / YIQ)
	const getContrastColor = (bgColor: string) => {
		let r = 0, g = 0, b = 0;
		if (bgColor.startsWith("#")) {
			const hex = bgColor.replace("#", "");
			r = parseInt(hex.substring(0, 2), 16) || 0;
			g = parseInt(hex.substring(2, 4), 16) || 0;
			b = parseInt(hex.substring(4, 6), 16) || 0;
		} else if (bgColor.startsWith("rgb")) {
			const parts = bgColor.replace(/rgb\(|\)/g, "").split(",").map(Number);
			r = parts[0] || 0;
			g = parts[1] || 0;
			b = parts[2] || 0;
		}

		// Luminancia YIQ
		const yiq = (r * 299 + g * 587 + b * 114) / 1000;
		return yiq >= 145 ? "#090d16" : "#ffffff";
	};

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
					className="flex items-center justify-center w-5 h-5 rounded-l font-mono font-bold text-[10px] shrink-0"
					style={{ 
						backgroundColor: posBgColor, 
						color: posTextColor,
					}}
				>
					{position}
				</div>
			)}
			<div 
				className="flex items-center gap-1 px-1.5 py-0.5 rounded-r h-5 transition-colors group-hover/tag:brightness-125"
				style={{ 
					backgroundColor: nameBgColor, 
					color: nameTextColor,
				}}
			>
				<p className="font-mono text-[10.5px] font-bold leading-none tracking-tight">
					{short}
				</p>
				<BarChart2 
					className="w-2.5 h-2.5 transition-opacity" 
					style={{ opacity: nameTextColor === "#ffffff" ? 0.7 : 0.85 }}
				/>
			</div>
		</div>
	);
}
