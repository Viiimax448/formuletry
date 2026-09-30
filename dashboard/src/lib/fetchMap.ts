import type { Map } from "@/types/map.type";

export const fetchMap = async (circuitKey: number): Promise<Map | null> => {
	const currentYear = new Date().getFullYear();
	const yearsToTry = [currentYear, 2025, 2024, 2023];

	for (const year of yearsToTry) {
		try {
			const mapRequest = await fetch(`https://api.multiviewer.app/api/v1/circuits/${circuitKey}/${year}`, {
				next: { revalidate: 60 * 60 * 2 },
			});

			if (mapRequest.ok) {
				return await mapRequest.json();
			}
		} catch {
			// Try next fallback year
		}
	}

	console.error(`Failed to fetch map for circuit ${circuitKey}`);
	return null;
};

