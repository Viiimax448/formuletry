export const getCustomTeamColor = (teamColor: string, driverTla?: string): string => {
	if (!driverTla) {
		return teamColor.startsWith("#") ? teamColor : `#${teamColor}`;
	}

	switch (driverTla) {
		case "BOR":
		case "HUL":
			return "#EA1B23"; // Audi Sport F1
		case "BOT":
		case "PER":
			return "#FFFFFF"; // Cadillac
		default:
			return teamColor.startsWith("#") ? teamColor : `#${teamColor}`;
	}
};

export const getDarkerTeamColor = (teamColor: string, driverTla?: string): string => {
	const color = getCustomTeamColor(teamColor, driverTla);

	if (driverTla === "BOT" || driverTla === "PER") {
		return "#D1D5DB"; // Gris claro para Cadillac
	}

	if (color.startsWith("#")) {
		const hex = color.replace("#", "");
		const r = parseInt(hex.substring(0, 2), 16) || 0;
		const g = parseInt(hex.substring(2, 4), 16) || 0;
		const b = parseInt(hex.substring(4, 6), 16) || 0;

		const darkenedR = Math.max(0, Math.floor(r * 0.65));
		const darkenedG = Math.max(0, Math.floor(g * 0.65));
		const darkenedB = Math.max(0, Math.floor(b * 0.65));

		return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
	}

	const rgb = color.replace(/rgb\(|\)/g, "").split(",").map(Number);
	const darkened = rgb.map((c) => Math.max(0, Math.floor((c || 0) * 0.65)));
	return `rgb(${darkened.join(", ")})`;
};

// Cálculo automático de contraste (fórmulas ITU-R / YIQ)
export const getContrastColor = (bgColor: string): string => {
	let r = 0,
		g = 0,
		b = 0;
	if (bgColor.startsWith("#")) {
		const hex = bgColor.replace("#", "");
		r = parseInt(hex.substring(0, 2), 16) || 0;
		g = parseInt(hex.substring(2, 4), 16) || 0;
		b = parseInt(hex.substring(4, 6), 16) || 0;
	} else if (bgColor.startsWith("rgb")) {
		const parts = bgColor.replace(/rgb\(|\)/g, "").split(",").map(Number);
		r = parts[0] || 0;
		g = parts[1] || 0;
		b = parts[2] || 0;
	}

	// Luminancia YIQ
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 145 ? "#090d16" : "#ffffff";
};

/**
 * Color secundario / de contraste oficial cuando dos pilotos son compañeros de equipo.
 * Inspirado en la regla oficial de la FIA (T-Cam fluorescente amarilla para el 2do auto)
 * y colores secundarios de librea (ej: Alpine BWT Pink, Ferrari Giallo Modena, McLaren Cyan, etc.)
 */
export const getTeammateDistinctColor = (teamName?: string, driverTla?: string): string => {
	const team = (teamName || "").toLowerCase();
	if (team.includes("alpine")) return "#FF87BC"; // Alpine BWT Pink
	if (team.includes("ferrari")) return "#FFE600"; // Ferrari Giallo Modena (Amarillo)
	if (team.includes("mclaren")) return "#00E5FF"; // McLaren Stealth Cyan
	if (team.includes("red bull") || team.includes("redbull")) return "#FFDD00"; // RBR Yellow
	if (team.includes("mercedes")) return "#E5E7EB"; // Mercedes Silver
	if (team.includes("aston")) return "#D6EB00"; // Aston Neon Lime
	if (team.includes("williams")) return "#FFDE00"; // Williams Yellow
	if (team.includes("haas")) return "#E6002B"; // Haas Red
	if (team.includes("racing bulls") || team.includes("rb")) return "#FF3B30"; // RB Red
	if (team.includes("audi")) return "#C0C0C0"; // Audi Silver
	if (team.includes("cadillac")) return "#FFC72C"; // Cadillac Gold

	// Fallback oficial FIA: Amarillo fluorescente T-Cam
	return "#FFE600";
};

export type ComparisonDriverInfo = {
	RacingNumber: string;
	TeamName?: string;
	TeamColour?: string;
	Tla?: string;
};

export const getComparisonColors = (
	driver1?: ComparisonDriverInfo,
	driver2?: ComparisonDriverInfo
): { color1: string; color2: string; isSameTeam: boolean } => {
	if (!driver1 || !driver2) {
		return {
			color1: getCustomTeamColor(driver1?.TeamColour || "0090FF", driver1?.Tla),
			color2: getCustomTeamColor(driver2?.TeamColour || "E8002D", driver2?.Tla),
			isSameTeam: false,
		};
	}

	const isSameTeam =
		(driver1.TeamName && driver2.TeamName && driver1.TeamName.toLowerCase() === driver2.TeamName.toLowerCase()) ||
		(driver1.TeamColour && driver2.TeamColour && driver1.TeamColour.toLowerCase() === driver2.TeamColour.toLowerCase());

	const color1 = getCustomTeamColor(driver1.TeamColour || "0090FF", driver1.Tla);

	if (isSameTeam) {
		const color2 = getTeammateDistinctColor(driver2.TeamName, driver2.Tla);
		return { color1, color2, isSameTeam: true };
	}

	const color2 = getCustomTeamColor(driver2.TeamColour || "E8002D", driver2.Tla);
	return { color1, color2, isSameTeam: false };
};

