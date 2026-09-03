"use client";

import { now, utc } from "moment";
import clsx from "clsx";
import type { Round as RoundType } from "@/types/schedule.type";
import { groupSessionByDay } from "@/lib/groupSessionByDay";
import { formatDayRange, formatMonth } from "@/lib/dateFormatter";
import Flag from "@/components/Flag";

type Props = {
	round: RoundType;
	nextName?: string;
	isHero?: boolean;
	roundIndex?: number;
};

const countryCodeMap: Record<string, string> = {
	Australia: "aus",
	Austria: "aut",
	Azerbaijan: "aze",
	Bahrain: "brn",
	Belgium: "bel",
	Brazil: "bra",
	Canada: "can",
	China: "chn",
	Spain: "esp",
	France: "fra",
	"Great Britain": "gbr",
	"United Kingdom": "gbr",
	Germany: "ger",
	Hungary: "hun",
	Italy: "ita",
	Japan: "jpn",
	"Saudi Arabia": "ksa",
	Mexico: "mex",
	Monaco: "mon",
	Netherlands: "ned",
	Portugal: "por",
	Qatar: "qat",
	Singapore: "sgp",
	"United Arab Emirates": "uae",
	"United States": "usa",
};

export default function Round({ round, nextName, isHero = false, roundIndex }: Props) {
	const countryCode = countryCodeMap[round.countryName] || "ned";
	const isCurrentActive = round.name === nextName;
	const isLive = !round.over && utc().isBetween(utc(round.start), utc(round.end));

	if (isHero) {
		return (
			<div className="grid gap-4 md:grid-cols-3">
				{groupSessionByDay(round.sessions).map((day, i) => (
					<div
						key={`hero.day.${i}`}
						className="rounded-2xl bg-neutral-950/80 border border-neutral-800/90 p-4 md:p-5 flex flex-col justify-between shadow-inner space-y-3"
					>
						<div className="flex items-center justify-between border-b border-neutral-800/60 pb-2.5">
							<h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-cyan-400">
								{utc(day.date).local().format("dddd")}
							</h4>
							<span className="text-[10px] font-mono text-neutral-400">
								{utc(day.date).local().format("MMM DD")}
							</span>
						</div>

						<div className="space-y-2">
							{day.sessions.map((session, j) => {
								const isRace = session.kind.toLowerCase() === "race";
								const isSprint = session.kind.toLowerCase().includes("sprint");
								const isQualy = session.kind.toLowerCase().includes("qualifying") || session.kind.toLowerCase().includes("qualification");
								const isPastSession = !round.over && utc(session.end).isBefore(now());

								return (
									<div
										key={`hero.day.${i}.session.${j}`}
										className={clsx(
											"flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all text-xs",
											isRace && "bg-red-500/15 border border-red-500/30 text-white font-bold shadow-xs",
											!isRace && (isSprint || isQualy) && "bg-cyan-500/10 border border-cyan-500/25 text-neutral-100 font-semibold",
											!isRace && !isSprint && !isQualy && "bg-neutral-900/90 border border-neutral-800 text-neutral-300",
											isPastSession && "opacity-50"
										)}
									>
										<div className="flex items-center gap-2 min-w-0">
											{isRace && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse shrink-0" />}
											<span className="truncate">{session.kind}</span>
										</div>
										<span className="font-mono text-[11px] text-neutral-400 shrink-0 pl-2">
											{utc(session.start).local().format("HH:mm")}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		);
	}

	const roundNumberText = round.name.toLowerCase().includes("testing")
		? "TEST"
		: roundIndex !== undefined
		? `R${String(roundIndex).padStart(2, "0")}`
		: "GP";

	return (
		<div
			className={clsx(
				"group relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg shadow-black/30",
				isCurrentActive
					? "border-2 border-cyan-500 bg-[#0c1322] shadow-[0_0_24px_rgba(6,182,212,0.2)]"
					: "bg-[#141414] border border-neutral-800 hover:border-neutral-700 hover:bg-[#181818]",
				round.over && "opacity-65 hover:opacity-90"
			)}
		>
			{/* Top Bar: Flag, Country & Round Info */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-3.5 min-w-0">
					<Flag
						countryCode={countryCode}
						className="h-9 w-14 rounded-lg shadow-md border border-neutral-700/60 group-hover:scale-105 transition-transform shrink-0"
					/>
					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.2 rounded">
								{roundNumberText}
							</span>
							<h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors truncate">
								{round.countryName}
							</h3>
						</div>
						<p className="text-[11px] font-medium text-neutral-400 truncate mt-0.5">
							{round.name}
						</p>
					</div>
				</div>

				<div className="text-right shrink-0">
					<span className="text-xs sm:text-sm font-bold font-mono text-neutral-300 block">
						{formatMonth(round.start, round.end)}
					</span>
					<span className="text-[10px] font-mono text-neutral-500">
						{formatDayRange(round.start, round.end)}
					</span>
				</div>
			</div>

			{/* Status Badges */}
			{(isCurrentActive || round.over) && (
				<div className="flex items-center gap-2">
					{isLive && (
						<span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
							<span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
							LIVE SESSION
						</span>
					)}
					{!isLive && isCurrentActive && (
						<span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
							<span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
							UP NEXT
						</span>
					)}
					{round.over && (
						<span className="inline-flex items-center rounded-full bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
							✓ COMPLETED
						</span>
					)}
				</div>
			)}

			{/* Daily Session Breakdown */}
			<div className="space-y-3 pt-1 border-t border-neutral-800/60">
				{groupSessionByDay(round.sessions).map((day, i) => (
					<div key={`round.day.${i}`} className="space-y-1.5">
						<div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
							<span>{utc(day.date).local().format("dddd")}</span>
							<span className="text-neutral-500 font-mono text-[9px]">
								{utc(day.date).local().format("MMM DD")}
							</span>
						</div>

						<div className="space-y-1">
							{day.sessions.map((session, j) => {
								const isRace = session.kind.toLowerCase() === "race";
								const isSprint = session.kind.toLowerCase().includes("sprint");
								const isQualy = session.kind.toLowerCase().includes("qualifying") || session.kind.toLowerCase().includes("qualification");
								const isPast = !round.over && utc(session.end).isBefore(now());

								return (
									<div
										key={`round.day.${i}.session.${j}`}
										className={clsx(
											"flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
											isRace && "bg-red-500/10 border border-red-500/20 font-bold text-red-300",
											!isRace && (isSprint || isQualy) && "bg-cyan-500/5 border border-cyan-500/15 text-neutral-200 font-medium",
											!isRace && !isSprint && !isQualy && "bg-neutral-900/60 text-neutral-300",
											isPast && "opacity-45"
										)}
									>
										<span className="truncate">{session.kind}</span>
										<span className="font-mono text-[10px] text-neutral-400 shrink-0 pl-2">
											{utc(session.start).local().format("HH:mm")}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
