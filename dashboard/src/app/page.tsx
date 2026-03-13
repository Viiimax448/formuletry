export const dynamic = "force-static";

import Link from "next/link";
import { getNextEvent } from "@/data/f1-calendar";
import Countdown from "@/components/schedule/Countdown";
import Flag from "@/components/Flag";
import SupportFooter from "@/components/SupportFooter";
import { utc } from "moment";
import type { Round } from "@/types/schedule.type";
import InstallButton from "@/components/InstallButton";
import DonationButton from "@/components/DonationButton";

const countryCodeMap: Record<string, string> = {
	Australia: "aus",
	Austria: "aut", 
	Azerbaijan: "aze",
	Bahrain: "brn",
	Belgium: "bel",
	Brazil: "bra",
	Canada: "can",
	China: "chn",
	Spain: "esp",
	France: "fra",
	"Great Britain": "gbr",
	"United Kingdom": "gbr",
	Germany: "ger",
	Hungary: "hun",
	Italy: "ita",
	Japan: "jpn",
	"Saudi Arabia": "ksa",
	Mexico: "mex",
	Monaco: "mon",
	Netherlands: "ned",
	Portugal: "por",
	Qatar: "qat",
	Singapore: "sgp",
	"United Arab Emirates": "uae",
	"United States": "usa",
};

function NextEventCard() {
	return (
		<Link href="/dashboard" prefetch={false} className="block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Flag countryCode="chn" className="h-8 w-12 rounded shadow-sm" />
					<div>
						<p className="text-xs font-medium uppercase tracking-wider text-blue-400">Next Event</p>
						<h3 className="text-lg font-bold font-sans text-white">
							Chinese Grand Prix
						</h3>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default function Home() {

	return (
		<main className="relative min-h-screen bg-deep-slate overflow-hidden">

		{/* Content */}
		<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
			{/* Hero Section */}
			<div className="text-center mb-8">
					{/* Brand */}
					<div className="mb-8">
						<h1 className="text-white/90 text-xl font-light tracking-[0.3em] mb-2">
							FORMULETRY
						</h1>
						<div className="w-24 h-px bg-linear-to-r from-transparent via-blue-400 to-transparent mx-auto" />
					</div>

					{/* Main Heading */}
					<h1 className="text-5xl md:text-7xl font-bold font-sans text-white leading-tight mb-6">
						Professional F1
						<br />
						<span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
							Telemetry
						</span>
					</h1>
					
					<p className="text-xl md:text-2xl font-light text-gray-400 max-w-2xl mx-auto leading-relaxed">
						Real-time timing data, advanced analysis, and live tracking.
					</p>
				</div>

				{/* Primary Actions */}
			<div className="mb-4">
					<Link href="/dashboard" prefetch={false}>
						<button className="group relative overflow-hidden bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
							<div className="absolute inset-0 bg-linear-to-r from-blue-400 to-cyan-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
								<div className="relative flex items-center space-x-3">
									<span className="tracking-wide">LAUNCH DASHBOARD</span>
								</div>
						</button>
					</Link>
				</div>

				{/* Install Button */}
			<div className="mb-4">
				</div>

		{/* Available Sponsor Space (Compact Mobile-First) */}
		<a 
			href="https://twitter.com/formuletry" 
			target="_blank" 
			rel="noopener noreferrer"
			className="block w-full max-w-lg mb-6"
		>
			<div className="group relative overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/5 backdrop-blur-sm p-3 hover:bg-white/10 hover:border-blue-400/50 transition-all cursor-pointer flex flex-row items-center gap-3 text-left">
				
				<div className="w-10 h-10 rounded flex-shrink-0 bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
					<span className="text-blue-400 text-xs font-bold tracking-wider">AD</span>
				</div>
				
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-bold text-white leading-tight">
						Tu Marca Aquí
					</h3>
					<p className="text-xs text-gray-400 truncate mt-0.5">
						Conecta con miles de fanáticos del motorsport.
					</p>
				</div>

				<div className="flex-shrink-0 text-gray-500 group-hover:text-blue-400 transition-colors pr-1">
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</div>
			</div>
		</a>

			{/* Next Event Widget */}
					<NextEventCard />
				</div>

				{/* Secondary Actions */}
				<div className="flex flex-row items-center justify-center gap-2 md:gap-3 mb-8 md:mb-16 w-full max-w-xl mx-auto">
					<a 
						href="https://twitter.com/formuletry" 
						target="_blank" 
						rel="noopener noreferrer"
						className="group flex-1 flex items-center justify-center gap-2 px-2 py-3 md:px-5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-md text-gray-300 hover:text-white font-medium transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]"
					>
						<svg className="w-4 h-4 md:w-5 md:h-5 text-blue-400 group-hover:scale-110 transition-transform shrink-0" fill="currentColor" viewBox="0 0 24 24">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
						</svg>
						<span className="text-xs md:text-sm tracking-wide truncate">Follow on X</span>
					</a>

					<DonationButton />
				</div>

				{/* Navigation Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
					{/* Calendar */}
					<Link href="/schedule" prefetch={false}>
						<div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/30 cursor-pointer">
							<div className="flex flex-col items-center text-center">
								<div className="mb-4 p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
									<svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
								<h3 className="text-white font-bold text-lg mb-2">Calendar</h3>
								<p className="text-sm text-gray-400">Race Schedule</p>
							</div>
						</div>
					</Link>

					{/* Standings */}
					<div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-500/10 cursor-not-allowed opacity-75">
						<div className="absolute top-3 right-3">
							<span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-full font-medium">Soon</span>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="mb-4 p-3 rounded-xl bg-gray-500/20 transition-colors">
								<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
							<h3 className="text-white font-bold text-lg mb-2">Standings</h3>
							<p className="text-sm text-gray-400">Championships</p>
						</div>
					</div>

					{/* Teams */}
					<div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-500/10 cursor-not-allowed opacity-75">
						<div className="absolute top-3 right-3">
							<span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-full font-medium">Soon</span>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="mb-4 p-3 rounded-xl bg-gray-500/20 transition-colors">
								<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
							<h3 className="text-white font-bold text-lg mb-2">Teams</h3>
							<p className="text-sm text-gray-400">Constructors</p>
						</div>
					</div>

					{/* Circuits */}
					<div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-500/10 cursor-not-allowed opacity-75">
						<div className="absolute top-3 right-3">
							<span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-full font-medium">Soon</span>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="mb-4 p-3 rounded-xl bg-gray-500/20 transition-colors">
								<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
							</div>
							<h3 className="text-white font-bold text-lg mb-2">Circuits</h3>
							<p className="text-sm text-gray-400">Track Layouts</p>
						</div>
					</div>
				</div>

				{/* SEO-friendly section */}
				<div className="mt-16 w-full max-w-7xl mx-auto px-6">
					<h2 className="text-3xl font-bold text-white mb-6 text-center">What is Formuletry?</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-gray-800 p-6 rounded-lg shadow-md">
							<h3 className="text-xl font-semibold text-blue-400 mb-4">Free Live Timing</h3>
							<p className="text-gray-300">
								Formuletry is a free platform that provides real-time live timing data for Formula 1 fans. With our tool, you can track every lap, sector, and mini-sector of your favorite drivers. Whether you are at home or on the go, Formuletry ensures you stay updated with the most accurate and detailed timing information available.
							</p>
						</div>
						<div className="bg-gray-800 p-6 rounded-lg shadow-md">
							<h3 className="text-xl font-semibold text-blue-400 mb-4">Using the Dashboard During Races</h3>
							<p className="text-gray-300">
								Access the live dashboard during races to get precise and up-to-date data. Simply open the website, select the ongoing race, and enjoy advanced telemetry features. Our intuitive interface makes it easy for fans of all levels to dive into the world of motorsport analytics.
							</p>
						</div>
						<div className="bg-gray-800 p-6 rounded-lg shadow-md">
							<h3 className="text-xl font-semibold text-blue-400 mb-4">The Best Free Alternative</h3>
							<p className="text-gray-300">
								Diseñado por y para fanáticos del motorsport, Formuletry combina funcionalidad y diseño para ofrecerte la mejor experiencia sin costo alguno. Es la herramienta ideal para quienes buscan datos confiables y detallados.
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<SupportFooter />
		</main>
	);
}
