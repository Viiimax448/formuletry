import { type ReactNode } from "react";
import Script from "next/script";

import "@/styles/globals.css";

import { env } from "@/env";
import EnvScript from "@/env-script";
import OledModeProvider from "@/components/OledModeProvider";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export { metadata } from "@/metadata";
export { viewport } from "@/viewport";

type Props = Readonly<{
	children: ReactNode;
}>;

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} font-sans text-white`}>
			<head>
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" />
				<EnvScript />

				{/* Google Analytics */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-FBZG0H582F"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-FBZG0H582F');
					`}
				</Script>

				{/* Microsoft Clarity */}
				<Script id="microsoft-clarity" strategy="afterInteractive">
					{`
						(function(c,l,a,r,i,t,y){
							c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
							t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
							y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
						})(window, document, "clarity", "script", "vess375ckw");
					`}
				</Script>

				{env.TRACKING_ID && env.TRACKING_URL && (
					<>
						<Script strategy="afterInteractive" data-site-id={env.TRACKING_ID} src={env.TRACKING_URL} />
					</>
				)}
			</head>

			<body className="bg-[#111827] min-h-screen">
				<OledModeProvider>{children}</OledModeProvider>
			</body>
		</html>
	);
}
