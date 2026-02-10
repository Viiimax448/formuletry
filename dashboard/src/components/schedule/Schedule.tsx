import { connection } from "next/server";

import Round from "@/components/schedule/Round";

import type { Round as RoundType } from "@/types/schedule.type";

import { getScheduleStatic } from "@/data/f1-calendar";

export const getSchedule = async () => {
	await connection();

	try {
		// Using static calendar data instead of API
		const schedule: RoundType[] = getScheduleStatic();
		console.log("Using static schedule data with", schedule.length, "events"); // Debug logging
		
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
