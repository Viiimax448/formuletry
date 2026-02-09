import { Suspense } from "react";

import NextRound from "@/components/schedule/NextRound";
import Schedule from "@/components/schedule/Schedule";

export default async function SchedulePage() {
	return (
		<div className="space-y-12">
			{/* Hero Section */}
			<div className="text-center">
				<h1 className="mb-2 text-5xl font-bold font-sans text-white">Up Next</h1>
				<p className="text-gray-400 font-medium">All times are local time</p>
			</div>

			<Suspense fallback={<NextRoundLoading />}>
				<NextRound />
			</Suspense>

			{/* Schedule Section */}
			<div className="text-center">
				<h2 className="mb-2 text-4xl font-bold font-sans text-white">2024 Season Calendar</h2>
				<p className="text-gray-400 font-medium">Explore the complete racing schedule</p>
			</div>

			<Suspense fallback={<FullScheduleLoading />}>
				<Schedule />
			</Suspense>
		</div>
	);
}

const RoundLoading = () => {
	return (
		<div className="overflow-hidden rounded-xl border border-white/10 bg-[#1F2937] p-6 shadow-lg">
			<div className="mb-6 flex items-start justify-between">
				<div className="flex items-center gap-4">
					<div className="h-8 w-12 animate-pulse rounded bg-white/10" />
					<div>
						<div className="mb-2 h-6 w-32 animate-pulse rounded bg-white/10" />
						<div className="h-4 w-24 animate-pulse rounded bg-white/10" />
					</div>
				</div>
				<div className="text-right">
					<div className="mb-1 h-6 w-16 animate-pulse rounded bg-white/10" />
					<div className="h-4 w-12 animate-pulse rounded bg-white/10" />
				</div>
			</div>

			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`day.${i}`}>
						<div className="mb-2 h-4 w-20 animate-pulse rounded bg-white/10" />
						<div className="space-y-2">
							<div className="h-9 w-full animate-pulse rounded-lg bg-white/5" />
							<div className="h-9 w-full animate-pulse rounded-lg bg-white/5" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const NextRoundLoading = () => {
	return (
		<div className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 shadow-lg backdrop-blur-sm">
			<div className="text-center">
				<div className="mx-auto mb-6 flex justify-center">
					<div className="h-20 w-20 animate-pulse rounded-lg bg-white/20" />
				</div>

				<div className="space-y-4">
					<div className="mx-auto h-10 w-48 animate-pulse rounded bg-white/20" />
					<div className="mx-auto h-6 w-32 animate-pulse rounded bg-white/10" />
				</div>
			</div>

			<div className="mt-8 grid gap-6 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div className="rounded-xl bg-white/5 p-4" key={`round.day.${i}`}>
						<div className="mb-4 h-6 w-32 animate-pulse rounded bg-white/10" />
						<div className="space-y-3">
							<div className="h-12 w-full animate-pulse rounded-lg bg-white/10" />
							<div className="h-12 w-full animate-pulse rounded-lg bg-white/10" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const FullScheduleLoading = () => {
	return (
		<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<RoundLoading key={`round.${i}`} />
			))}
		</div>
	);
};
