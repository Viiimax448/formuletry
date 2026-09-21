"use client";

import { useDemoDataEngine } from "@/hooks/useDemoDataEngine";

import LeaderBoard from "@/components/dashboard/LeaderBoard";
import RaceControl from "@/components/dashboard/RaceControl";
import TeamRadios from "@/components/dashboard/TeamRadios";
import TrackViolations from "@/components/dashboard/TrackViolations";
import Map from "@/components/dashboard/Map";
import DashboardSupportWidget from "@/components/dashboard/DashboardSupportWidget";
import LiveWeatherButton from "@/components/dashboard/LiveWeatherButton";
import DesktopHeader from "@/components/dashboard/DesktopHeader";
import MobileHeader from "@/components/dashboard/MobileHeader";

export default function DemoPage() {
	// Initialize and drive 2026 mock data simulation
	useDemoDataEngine();

	return (
		<div className="flex min-h-screen w-full flex-col bg-[#111827] p-2 md:p-4 gap-3 text-white">
			{/* Top Bar Desktop (Adapted Broadcast HUD) */}
			<DesktopHeader />

			{/* Top Bar Mobile (Compact F1 Broadcast HUD) */}
			<MobileHeader />

			{/* Main Grid: Leaderboard + Map */}
			<div className="flex w-full flex-col gap-2 lg:flex-row lg:items-start">
				<div className="w-full lg:w-auto lg:flex-shrink-0">
					<div className="overflow-x-auto md:overflow-x-visible">
						<LeaderBoard />
					</div>

					{/* Live Weather button inside LeaderBoard block */}
					<div className="mt-2 w-full">
						<LiveWeatherButton from="demo" />
					</div>
					<DashboardSupportWidget />
				</div>

				<div className="flex-1 w-full h-[35rem] lg:h-auto lg:min-h-[35rem]">
					<Map />
				</div>
			</div>

			{/* Secondary Panels: Race Control, Team Radio, Track Violations */}
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
