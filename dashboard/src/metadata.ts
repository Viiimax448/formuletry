import type { Metadata } from "next";

const title = "Formuletry | F1 Live Timing, Telemetry & Race Control Tracker";
const description =
	"Professional real-time Formula 1 live timing, advanced telemetry analysis, interactive GPS circuit map, sector times, tyre compound strategies, team radios, and official FIA race control messages.";

const url = "https://www.formuletry.com";

export const metadata: Metadata = {
	metadataBase: new URL(url),
	generator: "Next.js",
	applicationName: "Formuletry",
	title: {
		default: title,
		template: "%s | Formuletry",
	},
	description,
	keywords: [
		"Formuletry",
		"F1 Live Timing",
		"F1 Telemetry",
		"Telemetría F1",
		"Telemetria F1 en vivo",
		"Tiempos F1 en vivo",
		"Formula 1 Live Timing",
		"Formula 1 Telemetry",
		"F1 sector times",
		"F1 tyre compound",
		"F1 tyre strategy",
		"F1 team radio",
		"FIA race control",
		"F1 circuit map",
		"F1 GPS tracker",
		"F1 live dashboard",
		"F1 2026",
		"Live timing Formula 1 gratis",
	],
	authors: [{ name: "Formuletry", url }],
	creator: "Formuletry",
	publisher: "Formuletry",
	category: "sports",
	classification: "Motorsports / Formula 1 / Telemetry",
	alternates: {
		canonical: `${url}/dashboard/`,
		languages: {
			es: `${url}/dashboard/`,
			en: `${url}/dashboard/`,
		},
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "es_ES",
		alternateLocale: ["en_US", "es_MX", "es_AR", "pt_BR", "it_IT", "de_DE"],
		url: `${url}/dashboard/`,
		siteName: "Formuletry - F1 Live Telemetry",
		title,
		description,
		images: [
			{
				url: "/opengraph.webp",
				width: 1200,
				height: 630,
				alt: "Formuletry - Real-Time F1 Telemetry & Live Timing Dashboard",
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
		site: "@formuletry",
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
		statusBarStyle: "black-translucent",
		title: "Formuletry",
	},
	other: {
		google: "notranslate",
		"geo.region": "GLOBAL",
		"geo.placename": "Worldwide",
		distribution: "Global",
		rating: "General",
		"revisit-after": "1 days",
	},
};
