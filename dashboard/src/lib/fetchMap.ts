import type { Map } from "@/types/map.type";

// Aliases para mapear claves de circuitos que difieren de la numeración de multiviewer
const CIRCUIT_ALIASES: Record<string | number, number> = {
	17: 144, // Baku / Azerbaijan
};

export const fetchMap = async (circuitKey: number | string): Promise<Map | null> => {
	const currentYear = new Date().getFullYear();
	const yearsToTry = [currentYear, 2025, 2024, 2023, 2022, 2021, 2020, 2019];
	const resolvedKey = CIRCUIT_ALIASES[circuitKey] || circuitKey;

	for (const year of yearsToTry) {
		try {
			const mapRequest = await fetch(`https://api.multiviewer.app/api/v1/circuits/${resolvedKey}/${year}`, {
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
