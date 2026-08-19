"use client";

import LeaderBoard from "@/components/dashboard/LeaderBoard";
import RaceControl from "@/components/dashboard/RaceControl";
import TeamRadios from "@/components/dashboard/TeamRadios";
import TrackViolations from "@/components/dashboard/TrackViolations";
import Map from "@/components/dashboard/Map";
import DashboardSupportWidget from "@/components/dashboard/DashboardSupportWidget";
import Link from "next/link";

export default function Page() {
	return (
		<div className="flex w-full flex-col gap-2 bg-[#111827] p-4">
			<div className="flex w-full flex-col gap-2 lg:flex-row lg:items-start">
				<div className="w-full lg:w-auto lg:flex-shrink-0">
					<div className="overflow-x-auto md:overflow-x-visible">
						<LeaderBoard />
					</div>

					{/* Live Weather button inside LeaderBoard block */}
					<div className="mt-2 w-full">
						<Link
							href="/weather?from=dashboard"
							prefetch={false}
							className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10 hover:border-cyan-400/40 transition-colors duration-200"
						>
							<svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
							</svg>
							<div className="flex flex-col leading-tight">
								<span className="font-medium">Live Weather</span>
								<span className="text-[10px] text-gray-400">Radar &amp; forecast</span>
							</div>
						</Link>
					</div>
					<DashboardSupportWidget />
				</div>

				<div className="flex-1 w-full h-[35rem] lg:h-auto lg:min-h-[35rem]">
					<Map />
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="h-[30rem] overflow-y-auto rounded-xl bg-[#1F2937] border border-white/10 p-6 shadow-lg">
					<h2 className="text-lg font-semibold text-white mb-4">Race Control</h2>
					<RaceControl />
				</div>

				<div className="h-[30rem] overflow-y-auto rounded-xl bg-[#1F2937] border border-white/10 p-6 shadow-lg">
					<h2 className="text-lg font-semibold text-white mb-4">Team Radio</h2>
					<TeamRadios />
				</div>

				<div className="h-[30rem] overflow-y-auto rounded-xl bg-[#1F2937] border border-white/10 p-6 shadow-lg">
					<h2 className="text-lg font-semibold text-white mb-4">Track Violations</h2>
					<TrackViolations />
				</div>
			</div>
		</div>
	);
}
