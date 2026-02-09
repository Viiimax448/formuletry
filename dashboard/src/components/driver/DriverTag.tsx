import clsx from "clsx";

type Props = {
	teamColor: string;
	short: string;
	position?: number;
	className?: string;
};

export default function DriverTag({ position, teamColor, short, className }: Props) {
	// Function to darken the team color
	const darkenColor = (color: string, percent: number = 0.3) => {
		const hex = color.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);
		
		const darkenedR = Math.floor(r * (1 - percent));
		const darkenedG = Math.floor(g * (1 - percent));
		const darkenedB = Math.floor(b * (1 - percent));
		
		return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
	};

	return (
		<div
			id="walkthrough-driver-position"
			className={clsx(
				"flex w-fit items-center",
				className,
			)}
		>
			{position && (
				<div 
					className="flex items-center justify-center w-8 h-8 rounded-l font-mono font-black text-white text-lg"
					style={{ backgroundColor: `#${teamColor}` }}
				>
					{position}
				</div>
			)}

			<div 
				className="flex items-center justify-center rounded-r px-3 h-8"
				style={{ backgroundColor: darkenColor(teamColor) }}
			>
				<p className="font-mono text-white text-sm font-medium">
					{short}
				</p>
			</div>
		</div>
	);
}
