import { connection } from "next/server";
import { utc } from "moment";
import Countdown from "@/components/schedule/Countdown";
import Round from "@/components/schedule/Round";
import Flag from "@/components/Flag";
import { getNextEvent } from "@/data/f1-calendar";
import type { Round as RoundType } from "@/types/schedule.type";
import { Calendar, Radio } from "lucide-react";

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

export const getNext = async () => {
	await connection();

	try {
		const next: RoundType | undefined = getNextEvent();
		return next || null;
	} catch (e) {
		console.error("error fetching next round", e);
		return null;
	}
};

export default async function NextRound() {
	const next = await getNext();

	if (!next) {
		return (
			<div className="flex h-44 flex-col items-center justify-center rounded-2xl bg-[#141414] border border-neutral-800 text-neutral-400">
				<p className="text-sm font-medium">No upcoming race weekend found</p>
			</div>
		);
	}

	const countryCode = countryCodeMap[next.countryName] || "ned";
	const nextSession = next.sessions.filter((s) => utc(s.start) > utc() && s.kind.toLowerCase() !== "race")[0];
	const nextRace = next.sessions.find((s) => s.kind.toLowerCase() === "race");
	const isLive = next.sessions.some((s) => utc(s.start) <= utc() && utc(s.end) >= utc());

	return (
		<div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[#1a1a1a] p-6 md:p-8 shadow-2xl transition-all">
			{/* Ambient Gradient Overlay & Grid Pattern */}
			<div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/70 to-transparent z-10 pointer-events-none" />
			<div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

			{/* Main Content */}
			<div className="relative z-20 space-y-6 md:space-y-8">
				{/* Header Section */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
					<div className="flex items-center gap-4">
						<Flag
							countryCode={countryCode}
							className="h-12 sm:h-14 w-16 sm:w-20 rounded-xl shadow-lg border border-neutral-700/60 object-cover shrink-0"
						/>
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="flex h-2 w-2 relative">
									<span
										className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
											isLive ? "bg-red-400" : "bg-cyan-400"
										} opacity-75`}
									/>
									<span
										className={`relative inline-flex rounded-full h-2 w-2 ${
											isLive
												? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
												: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
										}`}
									/>
								</span>
								<span
									className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${
										isLive ? "text-red-400" : "text-cyan-400"
									}`}
								>
									{isLive ? "LIVE GP WEEKEND" : "UP NEXT"}
								</span>
							</div>
							<h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
								{next.countryName} Grand Prix
							</h2>
							<p className="text-xs sm:text-sm font-medium text-neutral-400">{next.name}</p>
						</div>
					</div>

					{/* Date Range Badge */}
					<div className="sm:text-right shrink-0">
						<span className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-400 block">
							{utc(next.start).format("MMM DD")} - {utc(next.end).format("DD")}
						</span>
						<span className="text-xs font-mono font-bold text-neutral-500">
							{utc(next.start).format("YYYY")} SEASON
						</span>
					</div>
				</div>

				{/* Countdown & Next Session Cards */}
				{(nextSession || nextRace) && (
					<div className="grid gap-4 md:grid-cols-2">
						{nextSession && (
							<div className="rounded-2xl bg-neutral-950/80 border border-neutral-800/90 p-5 flex flex-col justify-between shadow-inner">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-2">
										<Radio className="w-4 h-4 text-cyan-400" />
										<h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
											Next Session
										</h3>
									</div>
									<span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
										LOCAL TIME
									</span>
								</div>
								<div>
									<p className="text-xl font-bold uppercase tracking-tight text-white">
										{nextSession.kind}
									</p>
									<p className="text-sm font-mono text-neutral-300 mt-1">
										{utc(nextSession.start).local().format("dddd, MMM DD · HH:mm")}
									</p>
								</div>
							</div>
						)}

						{nextRace && (
							<div className="rounded-2xl bg-neutral-950/80 border border-neutral-800/90 p-5 shadow-inner">
								<Countdown next={nextRace} type="race" />
							</div>
						)}
					</div>
				)}

				{/* Full Weekend Sessions Schedule */}
				<div className="space-y-3 pt-2">
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-cyan-400" />
						<h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
							Weekend Session Breakdown
						</h3>
					</div>
					<Round round={next} isHero={true} />
				</div>
			</div>
		</div>
	);
}
