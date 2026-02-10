import { connection } from "next/server";
import { utc } from "moment";

import Countdown from "@/components/schedule/Countdown";
import Round from "@/components/schedule/Round";
import Flag from "@/components/Flag";

import { getNextEvent } from "@/data/f1-calendar";
import type { Round as RoundType } from "@/types/schedule.type";

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
		// Using static calendar data instead of API
		const next: RoundType | undefined = getNextEvent();
		console.log("Using static next event data:", next?.name); // Debug logging
		
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
			<div className="flex h-44 flex-col items-center justify-center">
				<p>No upcoming weekend found</p>
			</div>
		);
	}

	const countryCode = countryCodeMap[next.countryName];
	const nextSession = next.sessions.filter((s) => utc(s.start) > utc() && s.kind.toLowerCase() !== "race")[0];
	const nextRace = next.sessions.find((s) => s.kind.toLowerCase() == "race");

	return (
		<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-card to-deep-slate p-8 shadow-2xl">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
			
			{/* Content */}
			<div className="relative z-10">
				<div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
					{/* Race Info */}
					<div className="flex items-center gap-4">
						<Flag countryCode={countryCode} className="h-12 w-16 rounded-md shadow-lg" />
						<div>
							<h2 className="text-3xl font-bold font-sans text-white">{next.countryName} Grand Prix</h2>
							<p className="text-lg font-medium text-gray-300">{next.name}</p>
						</div>
					</div>
					
					{/* Date Range */}
					<div className="text-right">
						<p className="text-2xl font-bold font-mono text-blue-400">
							{utc(next.start).format("MMM DD")} - {utc(next.end).format("DD")}
						</p>
						<p className="text-sm font-medium text-gray-400">{utc(next.start).format("YYYY")}</p>
					</div>
				</div>

				{/* Countdown Section */}
				{(nextSession || nextRace) && (
					<div className="grid gap-8 lg:grid-cols-2">
						{nextSession && (
							<div className="rounded-xl bg-white/5 p-6">
								<h3 className="mb-4 text-xl font-semibold font-sans text-white">Next Session</h3>
								<Countdown next={nextSession} type="other" />
							</div>
						)}
						{nextRace && (
							<div className="rounded-xl bg-gradient-to-br from-red-900/30 to-red-800/20 p-6">
								<h3 className="mb-4 text-xl font-semibold font-sans text-white">Race Day</h3>
								<Countdown next={nextRace} type="race" />
							</div>
						)}
					</div>
				)}

				{/* Weekend Schedule */}
				<div className="mt-8">
					<h3 className="mb-4 text-xl font-semibold font-sans text-white">Weekend Schedule</h3>
					<Round round={next} isHero={true} />
				</div>
			</div>
		</div>
	);
}
