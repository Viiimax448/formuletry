import { connection } from "next/server";

import Round from "@/components/schedule/Round";

import type { Round as RoundType } from "@/types/schedule.type";

import { env } from "@/env";

export const getSchedule = async () => {
	await connection();

	try {
		const apiUrl = env.API_URL || "https://formuletry-production.up.railway.app";
		console.log("API URL:", apiUrl); // Debug logging
		
		const scheduleReq = await fetch(`${apiUrl}/api/schedule`, {
			cache: "no-store",
		});
		
		console.log("Schedule request status:", scheduleReq.status); // Debug logging
		
		if (!scheduleReq.ok) {
			throw new Error(`HTTP error! status: ${scheduleReq.status}`);
		}
		
		const schedule: RoundType[] = await scheduleReq.json();

		return schedule;
	} catch (e) {
		console.error("error fetching schedule", e);
		return null;
	}
};

export default async function Schedule() {
	const schedule = await getSchedule();

	if (!schedule) {
		return (
			<div className="flex h-44 flex-col items-center justify-center">
				<p>Schedule not found</p>
			</div>
		);
	}

	const next = schedule.filter((round) => !round.over)[0];

	return (
		<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			{schedule.map((round, roundI) => (
				<Round nextName={next?.name} round={round} key={`round.${roundI}`} />
			))}
		</div>
	);
}
