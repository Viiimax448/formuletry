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
				"text-[10px] inline-flex h-5 w-full items-center justify-center rounded border font-mono font-bold leading-none",
				{
					"border-zinc-700 text-zinc-700": !pit,
					"border-cyan-500 text-cyan-500 bg-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.25)]": pit,
				},
			)}
		>
			PIT
		</span>
	);
}
