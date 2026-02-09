import Link from "next/link";
import { Suspense } from "react";
import { getNext } from "@/components/schedule/NextRound";
import Countdown from "@/components/schedule/Countdown";
import Flag from "@/components/Flag";
import SupportFooter from "@/components/SupportFooter";
import { utc } from "moment";

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

async function NextEventCard() {
	const next = await getNext();
	
	if (!next) {
		return (
			<div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
				<div className="text-center text-gray-400">
					No upcoming events
				</div>
			</div>
		);
	}

	const countryCode = countryCodeMap[next.countryName];
	const nextSession = next.sessions.filter((s) => utc(s.start) > utc())[0];

	return (
		<div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Flag countryCode={countryCode} className="h-8 w-12 rounded shadow-sm" />
					<div>
						<p className="text-xs font-medium uppercase tracking-wider text-blue-400">Next Event</p>
						<h3 className="text-lg font-bold font-sans text-white">{next.countryName} Grand Prix</h3>
					</div>
				</div>
				{nextSession && (
					<div className="text-right">
						<p className="text-xs font-medium uppercase tracking-wider text-gray-400">
							{nextSession.kind}
						</p>
						<div className="font-mono text-sm text-white">
							{utc(nextSession.start).format("MMM DD, HH:mm")}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<div className="relative min-h-screen bg-deep-slate overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0">
				{/* Ambient Light */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-blue-900/20 via-blue-900/10 to-transparent blur-3xl" />
				
				{/* Grid Pattern */}
				<div 
					className="absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage: `
							linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
							linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
						`,
						backgroundSize: '50px 50px'
					}}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
				{/* Hero Section */}
				<div className="text-center mb-16">
					{/* Brand */}
					<div className="mb-8">
						<h1 className="text-white/90 text-xl font-light tracking-[0.3em] mb-2">
							FORMULETRY
						</h1>
						<div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto" />
					</div>

					{/* Main Heading */}
					<h1 className="text-5xl md:text-7xl font-bold font-sans text-white leading-tight mb-6">
						Professional F1
						<br />
						<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
							Telemetry
						</span>
					</h1>
					
					<p className="text-xl md:text-2xl font-light text-gray-400 max-w-2xl mx-auto leading-relaxed">
						Real-time timing data, advanced analysis, and live tracking.
					</p>
				</div>

				{/* Launch Button */}
				<div className="mb-12">
					<Link href="/dashboard">
						<button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
							<div className="relative flex items-center space-x-3">
								<span className="tracking-wide">LAUNCH DASHBOARD</span>
								<span className="text-2xl">🚀</span>
							</div>
						</button>
					</Link>
				</div>

				{/* Next Event Widget */}
				<div className="w-full max-w-lg mb-16">
					<Suspense fallback={
						<div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 animate-pulse">
							<div className="h-16 bg-white/10 rounded" />
						</div>
					}>
						<NextEventCard />
					</Suspense>
				</div>

				{/* Navigation Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
					{/* Calendar */}
					<Link href="/schedule">
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
			</div>

			{/* Footer */}
			<SupportFooter />
		</div>
	);
}
