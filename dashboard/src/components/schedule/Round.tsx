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

export default function Round({ round, nextName, isHero = false }: Props) {
	const countryCode = countryCodeMap[round.countryName];

	if (isHero) {
		return (
			<div className="grid gap-6 md:grid-cols-3">
				{groupSessionByDay(round.sessions).map((day, i) => (
					<div className="rounded-xl bg-white/5 p-4" key={`round.day.${i}`}>
						<h4 className="mb-4 text-lg font-semibold font-sans text-white">
							{utc(day.date).local().format("dddd, MMM DD")}
						</h4>

						<div className="space-y-3">
							{day.sessions.map((session, j) => (
								<div
									key={`round.day.${i}.session.${j}`}
									className={clsx(
										"flex items-center justify-between rounded-lg bg-white/10 p-3 transition-colors",
										!round.over && utc(session.end).isBefore(now()) && "opacity-50"
									)}
								>
									<span className="font-medium font-sans text-white">{session.kind}</span>
									<span className="font-mono text-sm text-gray-300">
										{utc(session.start).local().format("HH:mm")}
									</span>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={clsx(
			"group relative overflow-hidden rounded-xl border border-white/10 bg-slate-card p-6 shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-xl",
			round.over && "opacity-60"
		)}>
			{/* Header */}
			<div className="mb-6 flex items-start justify-between">
				<div className="flex items-center gap-4">
					<Flag countryCode={countryCode} className="h-8 w-12 rounded shadow-sm" />
					<div>
						<h3 className="text-xl font-bold font-sans text-white group-hover:text-blue-400 transition-colors">
							{round.countryName}
						</h3>
						<p className="text-sm font-medium text-gray-400">{round.name}</p>
					</div>
				</div>

				<div className="text-right">
					<p className="text-lg font-bold font-mono text-blue-400">
						{formatMonth(round.start, round.end)}
					</p>
					<p className="text-sm font-medium text-gray-500">
						{formatDayRange(round.start, round.end)}
					</p>
				</div>
			</div>

			{/* Status Badge */}
			{(round.name === nextName || round.over) && (
				<div className="mb-4">
					{round.name === nextName && (
						<span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
							{utc().isBetween(utc(round.start), utc(round.end)) ? "🔴 Live" : "⏳ Up Next"}
						</span>
					)}
					{round.over && (
						<span className="inline-flex items-center rounded-full bg-gray-500/20 px-3 py-1 text-xs font-medium text-gray-400">
							✓ Completed
						</span>
					)}
				</div>
			)}

			{/* Sessions */}
			<div className="space-y-4">
				{groupSessionByDay(round.sessions).map((day, i) => (
					<div key={`round.day.${i}`}>
						<h4 className="mb-2 text-sm font-semibold font-sans uppercase tracking-wide text-gray-300">
							{utc(day.date).local().format("dddd")}
						</h4>
						<div className="space-y-2">
							{day.sessions.map((session, j) => (
								<div
									key={`round.day.${i}.session.${j}`}
									className={clsx(
										"flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 transition-colors",
										!round.over && utc(session.end).isBefore(now()) && "opacity-50",
										session.kind.toLowerCase() === "race" && "bg-red-500/10 border border-red-500/20"
									)}
								>
									<span className={clsx(
										"font-medium font-sans",
										session.kind.toLowerCase() === "race" ? "text-red-400" : "text-white"
									)}>
										{session.kind}
									</span>
									<span className="font-mono text-xs text-blue-300">
										{utc(session.start).local().format("HH:mm")} - {utc(session.end).local().format("HH:mm")}
									</span>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
