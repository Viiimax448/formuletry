"use client";

import { useDemoDataEngine } from "@/hooks/useDemoDataEngine";

import LeaderBoard from "@/components/dashboard/LeaderBoard";
import RaceControl from "@/components/dashboard/RaceControl";
import TeamRadios from "@/components/dashboard/TeamRadios";
import TrackViolations from "@/components/dashboard/TrackViolations";
import Map from "@/components/dashboard/Map";
import DashboardSupportWidget from "@/components/dashboard/DashboardSupportWidget";
import DesktopHeader from "@/components/dashboard/DesktopHeader";
import MobileHeader from "@/components/dashboard/MobileHeader";
import TrackEventNotification from "@/components/dashboard/TrackEventNotification";

export default function DemoPage() {
	// Initialize and drive 2026 mock data simulation
	useDemoDataEngine();

	return (
		<div className="flex min-h-screen w-full flex-col bg-[#111827] p-2 md:p-4 gap-3 text-white">
			<TrackEventNotification />

			{/* Top Bar Desktop (Adapted Broadcast HUD) */}
			<DesktopHeader />

			{/* Top Bar Mobile (Compact F1 Broadcast HUD) */}
			<MobileHeader />

			{/* Leaderboard Table */}
			<div className="w-full">
				<div className="overflow-x-auto md:overflow-x-visible">
					<LeaderBoard />
				</div>

				<DashboardSupportWidget />
			</div>

			{/* Circuit Map (debajo de la tabla) */}
			<div className="w-full h-[28rem] md:h-[35rem] rounded-lg bg-[#151D2C] border border-gray-800/90 shadow-lg p-2 overflow-hidden flex flex-col">
				<Map />
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
