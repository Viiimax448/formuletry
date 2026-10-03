import type { Metadata } from "next";

const title = "Formuletry | Professional F1 Telemetry";
const description =
	"Real-time timing data, advanced analysis, and live tracking for Formula 1.";

const url = "https://www.formuletry.com";

export const metadata: Metadata = {
	generator: "Next.js",
	applicationName: "Formuletry",
	title: {
		default: title,
		template: "%s | Formuletry",
	},
	description,
	openGraph: {
		type: "website",
		locale: "en_US",
		url,
		siteName: "Formuletry",
		title,
		description,
		images: [
			{
				url: "/opengraph.webp",
				width: 1200,
				height: 630,
				alt: "Formuletry Dashboard",
				type: "image/webp",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: ["/opengraph.webp"],
		creator: "@formuletry",
	},
	icons: {
		icon: [
			{ url: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
		apple: [
			{ url: "/icon-192.png?v=formuletry", sizes: "192x192", type: "image/png" },
		],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Formuletry",
	},
	other: {
		google: "notranslate",
	},
};
