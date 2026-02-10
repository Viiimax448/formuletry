import type { Metadata } from "next";

const title = "Formuletry | Professional F1 Telemetry & Live Timing";
const description =
	"Professional Formula 1 telemetry platform. Real-time timing data, advanced analysis, live tracking, and comprehensive race insights. Open source F1 dashboard.";

const url = "https://formuletry.vercel.app";

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
		// Removed images - no Open Graph images configured
	},

	twitter: {
		site: "@MaximoLXXXI",
		title,
		description,
		creator: "@MaximoLXXXI",
		card: "summary_large_image",
		// Removed images - no Twitter card images configured
	},

	category: "Sports & Recreation",

	referrer: "strict-origin-when-cross-origin",

	keywords: ["Formula 1", "F1 telemetry", "professional racing data", "live timing", "race analysis", "motorsport dashboard", "F1 dashboard", "realtime F1"],

	creator: "MaximoLXXXI",
	publisher: "MaximoLXXXI",
	authors: [{ name: "MaximoLXXXI", url: "https://x.com/MaximoLXXXI" }],

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
		// Removed Google verification from previous project
	},

	manifest: "/manifest.json",
};
