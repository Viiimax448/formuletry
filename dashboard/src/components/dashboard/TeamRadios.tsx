"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Radio, Star } from "lucide-react";
import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { sortUtc } from "@/lib/sorting";
import RadioMessage from "@/components/dashboard/RadioMessage";

export default function TeamRadios() {
	const drivers = useDataStore((state) => state.state?.DriverList);
	const teamRadios = useDataStore((state) => state.state?.TeamRadio);
	const sessionPath = useDataStore((state) => state.state?.SessionInfo?.Path);
	const gmtOffset = useDataStore((state) => state.state?.SessionInfo?.GmtOffset);

	const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);
	const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

	const basePath = `https://livetiming.formula1.com/static/${sessionPath}`;

	const captures = (teamRadios?.Captures ?? [])
		.sort(sortUtc)
		.filter((radio) => {
			if (!onlyFavorites) return true;
			return favoriteDrivers.includes(radio.RacingNumber);
		})
		.slice(0, 20);

	return (
		<div className="flex h-full w-full flex-col">
			{/* Panel Header Styled like Top Header */}
			<div className="flex items-center justify-between pb-3 border-b border-gray-800/80 mb-3">
				{/* Title + Count */}
				<div className="flex items-center gap-2">
					<h2 className="text-sm font-semibold tracking-wide text-white uppercase font-sans flex items-center gap-1.5">
						<span>Team Radio</span>
					</h2>
					<span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono font-bold text-gray-300">
						{captures.length}
					</span>
				</div>

				{/* Filter by Favorites */}
				<button
					onClick={() => setOnlyFavorites(!onlyFavorites)}
					className={clsx(
						"px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1",
						onlyFavorites
							? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
							: "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10",
					)}
					title="Filtrar por pilotos favoritos"
				>
					<Star className={clsx("w-3 h-3", onlyFavorites && "fill-cyan-300")} />
					<span className="text-[11px]">{onlyFavorites ? "Favoritos" : "Todos"}</span>
				</button>
			</div>

			{/* Radio Feed List */}
			<div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
				{!teamRadios &&
					new Array(5).fill("").map((_, index) => <SkeletonMessage key={`radio.loading.${index}`} />)}

				{teamRadios && gmtOffset && drivers && (
					<AnimatePresence mode="popLayout">
						{captures.length > 0 ? (
							captures.map((teamRadio, i) => (
								<RadioMessage
									key={`radio.${teamRadio.Utc}.${teamRadio.RacingNumber}.${i}`}
									driver={drivers[teamRadio.RacingNumber]}
									capture={teamRadio}
									basePath={basePath}
									gmtOffset={gmtOffset}
								/>
							))
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
								<Radio className="w-8 h-8 text-gray-600 mb-2 stroke-[1.5]" />
								<p className="text-xs font-medium text-gray-400">
									{onlyFavorites ? "No hay radios de tus pilotos favoritos" : "No hay transmisiones de radio disponibles"}
								</p>
								<p className="text-[11px] text-gray-500">
									{onlyFavorites ? "Desactiva el filtro para ver todas las comunicaciones" : "Las comunicaciones de equipo aparecerán en vivo"}
								</p>
							</div>
						)}
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}

const SkeletonMessage = () => {
	const animateClass = "animate-pulse rounded bg-white/10";

	return (
		<div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
			<div className="mb-2 flex items-center justify-between">
				<div className={clsx(animateClass, "h-3.5 w-16")} />
				<div className={clsx(animateClass, "h-3.5 w-24")} />
			</div>

			<div className="flex items-center gap-3">
				<div className={clsx(animateClass, "h-7 w-12 rounded-full")} />
				<div className={clsx(animateClass, "h-7 w-7 rounded-full")} />
				<div className={clsx(animateClass, "h-2 flex-1 rounded-full")} />
			</div>
		</div>
	);
};
