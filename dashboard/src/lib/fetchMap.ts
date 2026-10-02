import type { Map } from "@/types/map.type";
import sepangData from "@/data/circuits/sepang.json";

const LOCAL_CIRCUITS: Record<string | number, Map> = {
	999: sepangData as unknown as Map,
	"sepang": sepangData as unknown as Map,
	"malaysia": sepangData as unknown as Map,
	"mas": sepangData as unknown as Map,
};

export const fetchMap = async (
	circuitKey?: number | string | null,
	circuitOverride?: "auto" | "sepang" | "bahrain" | string
): Promise<Map | null> => {
	// 1. Explicit user override to Sepang
	if (circuitOverride === "sepang") {
		return LOCAL_CIRCUITS[999];
	}

	const keyStr = String(circuitKey || "").toLowerCase();
	const numKey = Number(circuitKey);

	// 2. The 2026 Bahrain GP was replaced by Malaysia (Sepang) due to conflict.
	// In the live timing feed, the session still references Bahrain (circuit key 63).
	// Therefore, unless explicitly overridden to "bahrain", Bahrain displays Malaysia (Sepang)!
	if (circuitOverride !== "bahrain") {
		if (numKey === 63 || keyStr.includes("bahrain") || keyStr.includes("sakhir")) {
			return LOCAL_CIRCUITS[999];
		}
	}

	// 3. Direct local match by key or name for Malaysia / Sepang
	if (circuitKey && LOCAL_CIRCUITS[circuitKey]) {
		return LOCAL_CIRCUITS[circuitKey];
	}

	if (keyStr.includes("sepang") || keyStr.includes("malay") || keyStr.includes("mas")) {
		return LOCAL_CIRCUITS[999];
	}

	// 4. If explicit override to Bahrain, or any other regular calendar circuit
	const currentYear = new Date().getFullYear();
	const yearsToTry = [currentYear, 2025, 2024, 2023, 2022, 2021, 2020, 2019];
	const targetKey = circuitOverride === "bahrain" ? 63 : numKey;

	if (!isNaN(targetKey) && targetKey > 0) {
		for (const year of yearsToTry) {
			try {
				const mapRequest = await fetch(`https://api.multiviewer.app/api/v1/circuits/${targetKey}/${year}`, {
					next: { revalidate: 60 * 60 * 2 },
				});

				if (mapRequest.ok) {
					return await mapRequest.json();
				}
			} catch {
				// Try next fallback year
			}
		}
	}

	// 5. Default fallback to Sepang
	return LOCAL_CIRCUITS[999];
};
