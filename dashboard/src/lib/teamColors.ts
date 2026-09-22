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
