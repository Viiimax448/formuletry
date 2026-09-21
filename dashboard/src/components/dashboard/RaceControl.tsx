"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Search, Volume2, VolumeX, Flag, X, ShieldAlert, AlertTriangle } from "lucide-react";
import clsx from "clsx";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";
import { sortUtc } from "@/lib/sorting";
import { RaceControlMessage } from "@/components/dashboard/RaceControlMessage";
import type { Message } from "@/types/state.type";

type FilterCategory = "all" | "flags" | "penalties" | "favorites";

const findCarNumber = (message: string): string | undefined => {
	const match = message.match(/CAR (\d+)/i);
	return match?.[1];
};

export default function RaceControl() {
	const messages = useDataStore((state) => state.state?.RaceControlMessages?.Messages);
	const gmtOffset = useDataStore((state) => state.state?.SessionInfo?.GmtOffset);
	const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);

	const raceControlChime = useSettingsStore((state) => state.raceControlChime);
	const setRaceControlChime = useSettingsStore((state) => state.setRaceControlChime);
	const raceControlChimeVolume = useSettingsStore((state) => state.raceControlChimeVolume);

	const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [showSearch, setShowSearch] = useState<boolean>(false);

	const chimeRef = useRef<HTMLAudioElement | null>(null);
	const pastMessageTimestamps = useRef<string[] | null>(null);

	// Audio base64 embebido
	const CHIME_AUDIO_B64 =
		"data:audio/mpeg;base64,//vQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/70mQAD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVV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";

	useEffect(() => {
		if (typeof window !== "undefined") {
			const chime = new Audio(CHIME_AUDIO_B64);
			chime.volume = raceControlChimeVolume / 100;
			chimeRef.current = chime;

			return () => {
				chimeRef.current = null;
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (messages === undefined || messages === null) return;

		if (!pastMessageTimestamps.current) {
			pastMessageTimestamps.current = messages.map((msg) => msg.Utc);
			return;
		}

		const newMessages = messages.filter((msg) => !pastMessageTimestamps.current?.includes(msg.Utc));

		if (newMessages.length > 0 && raceControlChime) {
			chimeRef.current?.play();
		}

		pastMessageTimestamps.current = messages.map((msg) => msg.Utc);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	// Filter & search logic
	const filteredMessages = (messages ?? [])
		.sort(sortUtc)
		.filter((msg) => (msg.Flag ? msg.Flag.toLowerCase() !== "blue" : true))
		.filter((msg) => {
			if (activeFilter === "flags") {
				const isFlag = (msg.Flag && msg.Flag !== "CLEAR") || msg.Category === "SafetyCar" || msg.Message.toUpperCase().includes("SAFETY CAR") || msg.Message.toUpperCase().includes("VSC") || msg.Message.toUpperCase().includes("FLAG");
				return isFlag;
			}
			if (activeFilter === "penalties") {
				const upper = msg.Message.toUpperCase();
				return upper.includes("PENALTY") || upper.includes("INVESTIGATION") || upper.includes("INCIDENT") || upper.includes("WARNING") || upper.includes("DISQUALIFIED");
			}
			if (activeFilter === "favorites") {
				const carNr = findCarNumber(msg.Message);
				return carNr ? favoriteDrivers.includes(carNr) : false;
			}
			return true;
		})
		.filter((msg) => {
			if (!searchQuery.trim()) return true;
			const q = searchQuery.toLowerCase();
			return msg.Message.toLowerCase().includes(q) || (msg.Lap && `lap ${msg.Lap}`.includes(q));
		});

	return (
		<div className="flex h-full w-full flex-col">
			{/* Panel Header Styled like Top Header */}
			<div className="flex flex-col gap-2 pb-3 border-b border-gray-800/80 mb-3">
				<div className="flex items-center justify-between">
					{/* Title + Count */}
					<div className="flex items-center gap-2">
						<h2 className="text-sm font-semibold tracking-wide text-white uppercase font-sans flex items-center gap-1.5">
							<span>Race Control</span>
						</h2>
						<span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono font-bold text-gray-300">
							{filteredMessages.length}
						</span>
					</div>

					{/* Action Controls (Search + Sound) */}
					<div className="flex items-center gap-1">
						<button
							onClick={() => setShowSearch(!showSearch)}
							className={clsx(
								"p-1.5 rounded-md transition-colors",
								showSearch
									? "bg-white/15 text-white"
									: "text-gray-400 hover:text-white hover:bg-white/10",
							)}
							title="Buscar mensajes"
						>
							<Search className="w-3.5 h-3.5" />
						</button>

						<button
							onClick={() => setRaceControlChime(!raceControlChime)}
							className={clsx(
								"p-1.5 rounded-md transition-colors",
								raceControlChime
									? "text-emerald-400 hover:bg-emerald-500/10"
									: "text-gray-500 hover:text-gray-300 hover:bg-white/10",
							)}
							title={raceControlChime ? "Sonido activado (Chime)" : "Sonido silenciado"}
						>
							{raceControlChime ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
						</button>
					</div>
				</div>

				{/* Search Box Expandable */}
				{showSearch && (
					<div className="relative flex items-center">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Filtrar por piloto, curva o palabra..."
							className="w-full rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
							autoFocus
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery("")}
								className="absolute right-2 text-gray-400 hover:text-white"
							>
								<X className="w-3 h-3" />
							</button>
						)}
					</div>
				)}

				{/* Filter Chips Bar */}
				<div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
					<button
						onClick={() => setActiveFilter("all")}
						className={clsx(
							"px-1.5 py-0.5 rounded text-[10px] font-medium transition-all shrink-0 font-mono",
							activeFilter === "all"
								? "border border-white/30 text-white bg-white/10"
								: "bg-white/5 text-gray-400 border border-transparent hover:text-white hover:bg-white/10",
						)}
					>
						Todos
					</button>

					<button
						onClick={() => setActiveFilter("flags")}
						className={clsx(
							"px-1.5 py-0.5 rounded text-[10px] font-medium transition-all shrink-0 font-mono flex items-center gap-1",
							activeFilter === "flags"
								? "border border-amber-500/80 text-amber-400 bg-white/5"
								: "bg-white/5 text-gray-400 border border-transparent hover:text-white hover:bg-white/10",
						)}
					>
						<span>Banderas &amp; SC</span>
					</button>

					<button
						onClick={() => setActiveFilter("penalties")}
						className={clsx(
							"px-1.5 py-0.5 rounded text-[10px] font-medium transition-all shrink-0 font-mono flex items-center gap-1",
							activeFilter === "penalties"
								? "border border-red-500/80 text-red-400 bg-white/5"
								: "bg-white/5 text-gray-400 border border-transparent hover:text-white hover:bg-white/10",
						)}
					>
						<span>Sanciones</span>
					</button>

					<button
						onClick={() => setActiveFilter("favorites")}
						className={clsx(
							"px-1.5 py-0.5 rounded text-[10px] font-medium transition-all shrink-0 font-mono flex items-center gap-1",
							activeFilter === "favorites"
								? "border border-cyan-500/80 text-cyan-400 bg-white/5"
								: "bg-white/5 text-gray-400 border border-transparent hover:text-white hover:bg-white/10",
						)}
					>
						<span>★ Favs</span>
					</button>
				</div>
			</div>

			{/* Message Feed List */}
			<div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
				{!messages &&
					new Array(5).fill("").map((_, index) => <SkeletonMessage key={`msg.loading.${index}`} index={index} />)}

				{messages && gmtOffset && (
					<AnimatePresence mode="popLayout">
						{filteredMessages.length > 0 ? (
							filteredMessages.map((msg, i) => (
								<RaceControlMessage key={`msg.${msg.Utc}.${i}`} msg={msg} gmtOffset={gmtOffset} />
							))
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
								<Flag className="w-8 h-8 text-gray-600 mb-2 stroke-[1.5]" />
								<p className="text-xs font-medium text-gray-400">No hay mensajes con este filtro</p>
								<p className="text-[11px] text-gray-500">Prueba cambiando de categoría o término de búsqueda</p>
							</div>
						)}
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}

const SkeletonMessage = ({ index }: { index: number }) => {
	const animateClass = "animate-pulse rounded bg-white/10";
	const long = index % 3 === 0;

	return (
		<div className="rounded-lg border-l-4 border-l-gray-700 bg-white/[0.03] p-3 border border-white/5">
			<div className="mb-2 flex items-center gap-2">
				<div className={clsx(animateClass, "h-3.5 w-12")} />
				<div className={clsx(animateClass, "h-3.5 w-16")} />
				<div className={clsx(animateClass, "h-3.5 w-10 ml-auto")} />
			</div>

			<div className="flex gap-2">
				<div className={clsx(animateClass, "h-4", long ? "w-full" : "w-4/5")} />
			</div>
		</div>
	);
};
