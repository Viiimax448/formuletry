export const dynamic = "force-static";

import { Suspense } from "react";
import NextRound from "@/components/schedule/NextRound";
import Schedule from "@/components/schedule/Schedule";

export default async function SchedulePage() {
	return (
		<div className="space-y-10 md:space-y-14">
			{/* Page Header Section */}
			<div className="text-center pt-2">
				<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono mb-3 shadow-xs">
					<span>F1 2026 OFFICIAL CALENDAR</span>
				</div>
				<h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-[0.2em] md:tracking-[0.25em] text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)] leading-tight">
					RACE SCHEDULE
				</h1>
				<div className="w-20 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-2 md:mt-3" />
				<p className="text-xs sm:text-sm md:text-base text-neutral-400 font-medium max-w-xl mx-auto mt-2 md:mt-3 leading-relaxed">
					Local track times, session breakdowns, and live timing countdowns for the 2026 season.
				</p>
			</div>

			{/* Up Next Hero Section */}
			<section className="space-y-4">
				<Suspense fallback={<NextRoundLoading />}>
					<NextRound />
				</Suspense>
			</section>

			{/* Full Season Calendar Section */}
			<section className="space-y-6 pt-4">
				<div className="text-center">
					<h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
						All 2026 Grand Prix Rounds
					</h2>
					<p className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
						Explore the complete calendar from pre-season testing to the season finale
					</p>
				</div>

				<Suspense fallback={<FullScheduleLoading />}>
					<Schedule />
				</Suspense>
			</section>
		</div>
	);
}

const RoundLoading = () => {
	return (
		<div className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#141414] p-5 md:p-6 shadow-lg space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="h-9 w-13 animate-pulse rounded-lg bg-neutral-900" />
					<div className="space-y-1.5">
						<div className="h-5 w-28 animate-pulse rounded bg-neutral-900" />
						<div className="h-3.5 w-36 animate-pulse rounded bg-neutral-900" />
					</div>
				</div>
				<div className="space-y-1 text-right">
					<div className="h-4 w-16 animate-pulse rounded bg-neutral-900" />
					<div className="h-3 w-12 animate-pulse rounded bg-neutral-900" />
				</div>
			</div>

			<div className="space-y-2 pt-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`loading.row.${i}`} className="h-7 w-full animate-pulse rounded-lg bg-neutral-900/60" />
				))}
			</div>
		</div>
	);
};

const NextRoundLoading = () => {
	return (
		<div className="overflow-hidden rounded-3xl border border-neutral-800 bg-[#1a1a1a] p-6 md:p-8 shadow-2xl space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="h-14 w-20 animate-pulse rounded-xl bg-neutral-900" />
					<div className="space-y-2">
						<div className="h-7 w-48 animate-pulse rounded bg-neutral-900" />
						<div className="h-4 w-32 animate-pulse rounded bg-neutral-900" />
					</div>
				</div>
				<div className="h-8 w-28 animate-pulse rounded-full bg-neutral-900" />
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="h-28 animate-pulse rounded-2xl bg-neutral-950/80 border border-neutral-800" />
				<div className="h-28 animate-pulse rounded-2xl bg-neutral-950/80 border border-neutral-800" />
			</div>
		</div>
	);
};

const FullScheduleLoading = () => {
	return (
		<div className="grid gap-4 md:gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<RoundLoading key={`round.loading.${i}`} />
			))}
		</div>
	);
};
