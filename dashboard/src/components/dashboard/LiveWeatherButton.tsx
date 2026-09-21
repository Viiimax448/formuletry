"use client";

import Link from "next/link";
import { CloudSun, ChevronRight } from "lucide-react";

type Props = {
	from?: "dashboard" | "demo";
};

export default function LiveWeatherButton({ from = "dashboard" }: Props) {
	return (
		<Link
			href={`/weather?from=${from}`}
			prefetch={false}
			className="group flex w-full items-center justify-between rounded-lg border border-gray-600/30 bg-[#111827] px-3.5 py-2.5 shadow-sm transition-all duration-200 hover:border-gray-500/60 hover:bg-white/[0.04]"
		>
			<div className="flex items-center gap-2.5">
				<CloudSun className="w-4 h-4 text-cyan-400/90 transition-transform duration-200 group-hover:scale-110 shrink-0" />
				<div className="flex flex-col leading-tight">
					<span className="font-mono text-[11px] font-semibold tracking-wider text-gray-200 uppercase">
						Live Weather Radar
					</span>
					<span className="text-[10px] text-gray-500 transition-colors group-hover:text-gray-400">
						Radar Doppler &amp; pronóstico
					</span>
				</div>
			</div>

			<ChevronRight className="w-3.5 h-3.5 text-gray-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-300 shrink-0" />
		</Link>
	);
}
