import clsx from "clsx";

type Props = {
	on?: boolean;
	possible?: boolean;
	inPit: boolean;
	pitOut: boolean;
};

export default function DriverDRS({ inPit, pitOut }: Props) {
	const pit = inPit || pitOut;

	return (
		<span
			className={clsx(
				"text-xs inline-flex h-7 w-full items-center justify-center rounded border font-mono font-bold leading-none",
				{
					"border-zinc-800 text-zinc-600": !pit,
					"border-cyan-500/80 text-cyan-400 bg-cyan-500/10": pit,
				},
			)}
		>
			PIT
		</span>
	);
}
