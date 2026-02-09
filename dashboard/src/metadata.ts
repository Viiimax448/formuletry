import type { Metadata } from "next";

const title = "Formuletry | Professional F1 Telemetry & Live Timing";
const description =
	"Professional Formula 1 telemetry platform. Real-time timing data, advanced analysis, live tracking, and comprehensive race insights. Open source F1 dashboard.";

const url = "https://f1-dash.com";

export const metadata: Metadata = {
	generator: "Next.js",

	applicationName: title,

	title,
	description,

	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/iconformuletry.webp", sizes: "any" },
			{ url: "/favicon.png", sizes: "32x32", type: "image/png" }
		],
		apple: "/iconformuletry.webp",
		shortcut: "/favicon.ico"
	},

	openGraph: {
		title,
		description,
		url,
		type: "website",
		siteName: "Formuletry - Professional F1 Telemetry",
		images: [
			{
				alt: "Formuletry - Professional F1 Telemetry Dashboard",
				url: `${url}/og-image.png`,
				width: 1200,
				height: 630,
			},
		],
	},

	twitter: {
		site: "@Slowlydev",
		title,
		description,
		creator: "@Slowlydev",
		card: "summary_large_image",
		images: [
			{
				url: `${url}/twitter-image.png`,
				alt: "Formuletry - Professional F1 Telemetry Dashboard",
				width: 1200,
				height: 630,
			},
		],
	},

	category: "Sports & Recreation",

	referrer: "strict-origin-when-cross-origin",

	keywords: ["Formula 1", "F1 telemetry", "professional racing data", "live timing", "race analysis", "motorsport dashboard", "F1 dashboard", "realtime F1"],

	creator: "Slowlydev",
	publisher: "Slowlydev",
	authors: [{ name: "Slowlydev", url: "https://slowly.dev" }],

	appleWebApp: {
		capable: true,
		title: "Formuletry",
		statusBarStyle: "black-translucent",
	},

	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},

	metadataBase: new URL(url),

	alternates: {
		canonical: url,
	},

	verification: {
		google: "hKv0h7XtWgQ-pVNVKpwwb2wcCC2f0tBQ1X1IcDX50hg",
	},

	manifest: "/manifest.json",
};
