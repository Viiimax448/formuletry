/**
 * Utility functions for driver timing calculations, deltas and comparison
 */

export function parseTimeToSeconds(timeStr?: string | null): number | null {
	if (!timeStr) return null;
	const trimmed = timeStr.trim().replace("+", "");
	if (!trimmed || trimmed === "LEADER" || trimmed === "STOP") return null;

	// Check for format mm:ss.ms (e.g., "1:21.198" or "1:44.843")
	if (trimmed.includes(":")) {
		const parts = trimmed.split(":");
		if (parts.length === 2) {
			const minutes = parseFloat(parts[0]);
			const seconds = parseFloat(parts[1]);
			if (!isNaN(minutes) && !isNaN(seconds)) {
				return minutes * 60 + seconds;
			}
		}
	}

	// Format ss.ms (e.g., "26.745" or "42.867")
	const sec = parseFloat(trimmed);
	if (!isNaN(sec)) {
		return sec;
	}

	return null;
}

export function formatDeltaSeconds(delta: number | null): string {
	if (delta === null || isNaN(delta)) return "--";
	if (Math.abs(delta) < 0.0005) return "0.000";
	const sign = delta > 0 ? "+" : "-";
	return `${sign}${Math.abs(delta).toFixed(3)}`;
}

export function formatSecondsToTime(seconds: number | null): string {
	if (seconds === null || isNaN(seconds) || seconds <= 0) return "--:--.---";
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	if (mins > 0) {
		return `${mins}:${secs < 10 ? "0" : ""}${secs.toFixed(3)}`;
	}
	return secs.toFixed(3);
}

export type SectorComparison = {
	driver1Time: string;
	driver2Time: string;
	driver1Seconds: number | null;
	driver2Seconds: number | null;
	delta: number | null; // driver2 - driver1 (positive means driver1 is faster)
	winner: 1 | 2 | "tie" | null;
};

export function compareSectors(
	s1Value?: string,
	s2Value?: string
): SectorComparison {
	const t1 = parseTimeToSeconds(s1Value);
	const t2 = parseTimeToSeconds(s2Value);

	if (t1 === null && t2 === null) {
		return {
			driver1Time: s1Value || "--",
			driver2Time: s2Value || "--",
			driver1Seconds: null,
			driver2Seconds: null,
			delta: null,
			winner: null,
		};
	}

	if (t1 === null) {
		return {
			driver1Time: s1Value || "--",
			driver2Time: s2Value || "--",
			driver1Seconds: null,
			driver2Seconds: t2,
			delta: null,
			winner: 2,
		};
	}

	if (t2 === null) {
		return {
			driver1Time: s1Value || "--",
			driver2Time: s2Value || "--",
			driver1Seconds: t1,
			driver2Seconds: null,
			delta: null,
			winner: 1,
		};
	}

	const delta = t2 - t1; // positive => Driver 1 is faster
	let winner: 1 | 2 | "tie" = "tie";
	if (Math.abs(delta) > 0.0005) {
		winner = delta > 0 ? 1 : 2;
	}

	return {
		driver1Time: s1Value || "--",
		driver2Time: s2Value || "--",
		driver1Seconds: t1,
		driver2Seconds: t2,
		delta,
		winner,
	};
}
