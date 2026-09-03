"use client";

import { useMemo } from "react";
import Round from "@/components/schedule/Round";
import type { Round as RoundType } from "@/types/schedule.type";
import { getScheduleStatic, getNextEvent } from "@/data/f1-calendar";

export default function Schedule() {
	const { sortedSchedule, activeRoundName } = useMemo(() => {
		const now = new Date();

		// Clean up raw schedule names
		const rawSchedule: RoundType[] = getScheduleStatic().map((event) => {
			if (event.name.includes("PRE-SEASON TESTING")) {
				return {
					...event,
					name: event.name.replace("PRE-SEASON TESTING", "Preseason Testing Day"),
				};
			}
			return event;
		});

		// Calculate dynamic time status for every race
		const enhanced = rawSchedule.map((round, idx) => {
			const start = new Date(round.start);
			const end = new Date(round.end);
			const isOver = end < now;
			const isCurrent = now >= start && now <= end;
			const isUpcoming = start > now;

			return {
				...round,
				over: isOver,
				isCurrent,
				isUpcoming,
				originalIndex: idx + 1,
			};
		});

		// Find the active round (current in progress or the next upcoming)
		const active =
			enhanced.find((r) => r.isCurrent) ||
			enhanced.find((r) => r.isUpcoming) ||
			enhanced[0];

		const activeName = active?.name;

		// 1. Actual / Siguiente
		const currentOrNext = enhanced.filter((r) => r.name === activeName);

		// 2. Próximos (resto de futuras carreras)
		const upcoming = enhanced.filter(
			(r) => r.isUpcoming && r.name !== activeName
		);

		// 3. Pasados (carreras que ya finalizaron)
		const past = enhanced.filter(
			(r) => r.over && r.name !== activeName
		);

		// Combinar en orden: Actual -> Próximos -> Pasados
		return {
			sortedSchedule: [...currentOrNext, ...upcoming, ...past],
			activeRoundName: activeName,
		};
	}, []);

	return (
		<div className="space-y-6">
			{/* Grid de Carreras Ordenadas: Actual -> Próximas -> Pasadas */}
			<div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
				{sortedSchedule.map((round) => (
					<Round
						key={round.name}
						nextName={activeRoundName}
						round={round}
						roundIndex={round.originalIndex}
					/>
				))}
			</div>
		</div>
	);
}