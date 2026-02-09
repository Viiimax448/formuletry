"use client";

import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";

import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";

export default function TrackInfo() {
	const lapCount = useDataStore((state) => state.state?.LapCount);
	const track = useDataStore((state) => state.state?.TrackStatus);

	const currentTrackStatus = getTrackStatusMessage(track?.Status ? parseInt(track?.Status) : undefined);

	// Map status codes to dot colors
	const getDotColor = (statusCode: number | undefined) => {
		switch (statusCode) {
			case 1: // Track Clear
				return "#10B981"; // Green Emerald
			case 2: // Yellow Flag
			case 3: // Flag
			case 4: // Safety Car
			case 6: // VSC Deployed
			case 7: // VSC Ending
				return "#F59E0B"; // Amber/Orange
			case 5: // Red Flag
				return "#EF4444"; // Red
			default:
				return "#10B981"; // Default to green
		}
	};

	return (
		<div className="flex flex-row items-center justify-between md:justify-end md:gap-4 w-full">
			{/* Lap Count - Left aligned on mobile, part of right group on desktop */}
			{!!lapCount && (
				<div className="flex justify-center md:justify-start">
					<p className="text-3xl font-extrabold whitespace-nowrap font-mono">
						{lapCount?.CurrentLap} / {lapCount?.TotalLaps}
					</p>
				</div>
			)}

			{/* Track Status - Right aligned on mobile, part of right group on desktop */}
			{!!currentTrackStatus ? (
				<div className="flex items-center justify-center gap-2 md:justify-start">
					<div
						className="w-2.5 h-2.5 rounded-full animate-pulse-dot"
						style={{
							backgroundColor: getDotColor(track?.Status ? parseInt(track?.Status) : undefined),
							boxShadow: `0 0 10px ${getDotColor(track?.Status ? parseInt(track?.Status) : undefined)}40`,
						}}
					/>
					<p 
						className="text-sm font-semibold font-mono uppercase"
						style={{
							color: getDotColor(track?.Status ? parseInt(track?.Status) : undefined)
						}}
					>
						{currentTrackStatus.message}
					</p>
				</div>
			) : (
				<div className="flex items-center justify-center gap-2 md:justify-start">
					<div className="w-2.5 h-2.5 rounded-full animate-pulse bg-zinc-700" />
					<div className="h-4 w-20 animate-pulse rounded bg-zinc-700" />
				</div>
			)}
		</div>
	);
}
