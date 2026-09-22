"use client";

import LeaderBoard from "@/components/dashboard/LeaderBoard";
import RaceControl from "@/components/dashboard/RaceControl";
import TeamRadios from "@/components/dashboard/TeamRadios";
import TrackViolations from "@/components/dashboard/TrackViolations";
import Map from "@/components/dashboard/Map";
import DashboardSupportWidget from "@/components/dashboard/DashboardSupportWidget";
import LiveWeatherButton from "@/components/dashboard/LiveWeatherButton";

export default function Page() {
	return (
		<div className="flex w-full flex-col gap-2 bg-[#111827] p-0">
			<div className="flex w-full flex-col gap-2 lg:flex-row lg:items-start">
				<div className="w-full lg:w-auto lg:flex-shrink-0">
					<div className="overflow-x-auto md:overflow-x-visible">
						<LeaderBoard />
					</div>

					{/* Live Weather button inside LeaderBoard block */}
					<div className="mt-2 w-full">
						<LiveWeatherButton from="dashboard" />
					</div>
					<DashboardSupportWidget />
				</div>

				<div className="flex-1 w-full h-[35rem] lg:h-auto lg:min-h-[35rem]">
					<Map />
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
				<div className="flex h-[32rem] flex-col rounded-lg bg-[#111827] border border-gray-600/30 p-4 shadow-lg overflow-hidden">
					<RaceControl />
				</div>

				<div className="flex h-[32rem] flex-col rounded-lg bg-[#111827] border border-gray-600/30 p-4 shadow-lg overflow-hidden">
					<TeamRadios />
				</div>

				<div className="flex h-[32rem] flex-col rounded-lg bg-[#111827] border border-gray-600/30 p-4 shadow-lg overflow-hidden">
					<TrackViolations />
				</div>
			</div>
		</div>
	);
}
