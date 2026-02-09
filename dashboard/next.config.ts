import type { NextConfig } from "next";

import pack from "./package.json" with { type: "json" };

import "@/env";

const output = process.env.NEXT_STANDALONE === "1" ? "standalone" : process.env.NEXT_EXPORT === "1" ? "export" : undefined;
const compress = process.env.NEXT_NO_COMPRESS === "1";

const frameDisableHeaders = [
	{
		source: "/(.*)",
		headers: [
			{
				type: "header",
				key: "X-Frame-Options",
				value: "SAMEORIGIN",
			},
			{
				type: "header",
				key: "Content-Security-Policy",
				value: "frame-ancestors 'self';",
			},
		],
	},
];

const config: NextConfig = {
	output,
	compress,
	devIndicators: false,
	trailingSlash: true,
	distDir: process.env.NEXT_EXPORT === "1" ? "out" : ".next",
	env: {
		version: pack.version,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**formula1.com",
				port: "",
			},
		],
	},
	headers: async () => frameDisableHeaders,
};

export default config;
