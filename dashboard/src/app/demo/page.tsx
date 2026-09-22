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
import TrackEventNotification from "@/components/dashboard/TrackEventNotification";
import { useDataStore } from "@/stores/useDataStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { getEventSeverity } from "@/components/dashboard/TrackEventNotification";
import type { Message } from "@/types/state.type";
import { Bell, Siren, AlertTriangle, ShieldAlert, Flag } from "lucide-react";

export default function DemoPage() {
	// Initialize and drive 2026 mock data simulation
	useDemoDataEngine();

	const triggerDemoNotification = (msg: Message, driverNum?: string) => {
		const drivers = useDataStore.getState().state?.DriverList;
		const driver = driverNum && drivers ? drivers[driverNum] : undefined;

		// 1. Mostrar la notificación flotante inmediatamente
		useNotificationStore.getState().showNotification({
			id: `${Date.now()}_${msg.Message}`,
			message: msg.Message,
			flag: msg.Flag,
			category: msg.Category,
			lap: msg.Lap,
			utc: msg.Utc,
			driver,
			severity: getEventSeverity(msg.Message, msg.Flag, msg.Category),
		});

		// 2. Añadir también a la lista de mensajes en vivo
		const currentState = useDataStore.getState().state;
		const currentMessages = currentState?.RaceControlMessages?.Messages ?? [];
		useDataStore.getState().setState({
			RaceControlMessages: {
				Messages: [...currentMessages, msg],
			},
		});
	};

	return (
		<div className="flex min-h-screen w-full flex-col bg-[#111827] p-2 md:p-4 gap-3 text-white">
			<TrackEventNotification />

			{/* Demo Test Notifications Bar */}
			<div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs">
				<div className="flex items-center gap-1.5 font-mono text-cyan-400 font-bold">
					<Bell className="w-3.5 h-3.5 animate-bounce" />
					<span>PROBAR NOTIFICACIONES EN VIVO:</span>
				</div>

				<div className="flex flex-wrap items-center gap-1.5">
					<button
						onClick={() =>
							triggerDemoNotification({
								Utc: new Date().toISOString(),
								Lap: 32,
								Category: "SafetyCar",
								Flag: "YELLOW",
								Message: "SAFETY CAR DEPLOYED - INCIDENT AT TURN 1",
							})
						}
						className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all font-mono font-semibold"
					>
						<Siren className="w-3 h-3" />
						<span>Safety Car</span>
					</button>

					<button
						onClick={() =>
							triggerDemoNotification({
								Utc: new Date().toISOString(),
								Lap: 32,
								Category: "Other",
								Flag: "YELLOW",
								Message: "VSC DEPLOYED - VIRTUAL SAFETY CAR",
							})
						}
						className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all font-mono font-semibold"
					>
						<AlertTriangle className="w-3 h-3" />
						<span>VSC</span>
					</button>

					<button
						onClick={() =>
							triggerDemoNotification(
								{
									Utc: new Date().toISOString(),
									Lap: 33,
									Category: "Flag",
									Flag: "YELLOW",
									Sector: 2,
									Message: "YELLOW FLAG IN SECTOR 2 - CAR 18 (STR) TOUCHED BARRIER AT TURN 8",
								},
								"18",
							)
						}
						className="flex items-center gap-1 px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 hover:bg-yellow-500/30 transition-all font-mono font-semibold"
					>
						<div className="w-2.5 h-2 rounded-[1px] bg-yellow-400" />
						<span>Bandera Amarilla</span>
					</button>

					<button
						onClick={() =>
							triggerDemoNotification({
								Utc: new Date().toISOString(),
								Lap: 34,
								Category: "Other",
								Flag: "RED",
								Message: "RED FLAG - SESSION SUSPENDED - BARRIER REPAIR AT TURN 15",
							})
						}
						className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all font-mono font-semibold"
					>
						<ShieldAlert className="w-3 h-3" />
						<span>Bandera Roja</span>
					</button>

					<button
						onClick={() =>
							triggerDemoNotification(
								{
									Utc: new Date().toISOString(),
									Lap: 35,
									Category: "Other",
									Flag: "BLACK AND WHITE",
									Message: "CAR 44 (HAM) TRACK LIMITS AT TURN 15 - LAP TIME DELETED",
								},
								"44",
							)
						}
						className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 text-gray-200 border border-white/20 hover:bg-white/20 transition-all font-mono font-semibold"
					>
						<Flag className="w-3 h-3" />
						<span>Track Limits (HAM)</span>
					</button>
				</div>
			</div>

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
