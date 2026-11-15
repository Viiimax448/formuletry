import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Formuletry | F1 Live Timing & Telemetry",
		short_name: "Formuletry",
		description:
			"Professional real-time Formula 1 live timing, advanced telemetry analysis, and interactive GPS circuit map.",
		start_url: "/dashboard/",
		display: "standalone",
		orientation: "any",
		background_color: "#111827",
		theme_color: "#111827",
		lang: "es",
		categories: ["sports", "entertainment", "utilities"],
		icons: [
			{ src: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
	};
}
