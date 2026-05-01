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
					<Flag countryCode="usa" className="h-8 w-12 rounded shadow-sm" />
					<div>
						<p className="text-xs font-medium uppercase tracking-wider text-blue-400">Next Event</p>
						<h3 className="text-lg font-bold font-sans text-white">
							Miami Grand Prix
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
				<div className="flex flex-row items-stretch justify-center gap-3 md:gap-4 mb-8 w-full max-w-md mx-auto px-4">
					{/* Launch Dashboard */}
					<Link href="/dashboard" prefetch={false} className="flex-1">
						<button className="w-full h-full group relative overflow-hidden bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-4 md:px-6 rounded-2xl md:text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center text-center">
							<div className="absolute inset-0 bg-linear-to-r from-blue-400 to-cyan-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
							<span className="relative tracking-wide leading-tight">LAUNCH DASHBOARD</span>
						</button>
					</Link>

					{/* Install Button */}
					<div className="w-[84px] md:w-[96px] shrink-0">
						<InstallButton />
					</div>
				</div>

				{/* Next Event Widget */}
				<div className="w-full max-w-lg mb-6">
					<NextEventCard />
				</div>

			{/* Banner de Ads Home */}
			<a
				href="https://twitter.com/formuletry"
				target="_blank"
				rel="noopener noreferrer"
				className="block w-full max-w-lg mb-6"
			>
				<div className="group relative overflow-hidden rounded-xl border border-dotted border-white/20 bg-white/5 backdrop-blur-sm p-3 hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer flex flex-row items-center gap-3 text-left shadow-lg shadow-black/20">
				
				{/* Icono genérico del banner */}
				<div className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden bg-[#111] border border-white/5 flex items-center justify-center">
					<svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M4 5h16M4 12h16M4 19h10"
						/>
					</svg>
				</div>
				
				{/* Textos y Badge */}
				<div className="flex-1 min-w-0 flex flex-col justify-center">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-bold text-white leading-tight">
							Tu marca aquí
						</h3>
						<span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded tracking-wider">AD</span>
					</div>
					<p className="text-xs text-gray-400 mt-1 leading-snug pr-2">
						Conecta con miles de fans de motorsport.
					</p>
				</div>

				{/* Flecha */}
				<div className="flex-shrink-0 text-gray-500 group-hover:text-white transition-colors pl-1">
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</div>
				</div>
			</a>

				{/* Bento Navigation Grid */}
				<div className="grid grid-cols-4 gap-2 md:gap-4 w-full max-w-3xl mx-auto mb-16 px-2 md:px-0">
					{/* Race Calendar (Fila completa) */}
					<Link
							href="/schedule"
							prefetch={false}
							className="col-span-4 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-3 md:p-6 hover:bg-white/10 transition-all duration-300"
					>
						<div className="flex flex-row items-center justify-center gap-3 md:gap-4">
							<svg className="w-8 h-8 md:w-10 md:h-10 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<div className="flex flex-col leading-tight text-left">
								<span className="text-white font-semibold text-xs md:text-sm uppercase tracking-wide">Race</span>
								<span className="text-white font-medium text-sm md:text-lg">Calendar</span>
							</div>
						</div>
					</Link>

					{/* Race Weather (Cuadrado grande - 2x2) */}
					<Link
							href="/weather?from=home"
							prefetch={false}
							className="col-span-2 row-span-2 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-4 md:p-8 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[10rem] md:min-h-[14rem]"
					>
						<svg className="w-10 h-10 md:w-16 md:h-16 text-blue-400 mb-2 md:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
							/>
						</svg>
						<span className="text-white font-medium text-base md:text-xl text-center leading-tight">Race Weather</span>
					</Link>

					{/* Circuits (Pequeño) */}
					<div className="col-span-1 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-2 md:p-4 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center opacity-75 cursor-not-allowed aspect-square">
						<svg className="w-5 h-5 md:w-8 md:h-8 text-gray-400 mb-1 md:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
							/>
						</svg>
						<span className="text-gray-300 font-medium text-[10px] md:text-sm">Circuits</span>
					</div>

					{/* Standings (Pequeño) */}
					<div className="col-span-1 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-2 md:p-4 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center opacity-75 cursor-not-allowed aspect-square">
						<svg className="w-5 h-5 md:w-8 md:h-8 text-gray-400 mb-1 md:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
						<span className="text-gray-300 font-medium text-[10px] md:text-sm truncate w-full text-center">Standings</span>
					</div>

					{/* Instagram (Pequeño - Reemplaza Fantasy) */}
					<a
							href="https://instagram.com/formuletry"
							target="_blank"
							rel="noopener noreferrer"
							className="col-span-1 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-2 md:p-4 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center aspect-square"
					>
						<svg className="w-5 h-5 md:w-8 md:h-8 text-pink-500 mb-1 md:mb-2" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
						</svg>
						<span className="text-gray-300 font-medium text-[10px] md:text-sm">Instagram</span>
					</a>

					{/* Teams (Pequeño) */}
					<div className="col-span-1 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-2 md:p-4 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center opacity-75 cursor-not-allowed aspect-square">
						<svg className="w-5 h-5 md:w-8 md:h-8 text-gray-400 mb-1 md:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
						<span className="text-gray-300 font-medium text-[10px] md:text-sm">Teams</span>
					</div>

					{/* Follow on X (Rectángulo Inferior) */}
					<a
							href="https://twitter.com/formuletry"
							target="_blank"
							rel="noopener noreferrer"
							className="col-span-2 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-3 md:p-6 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[5rem]"
					>
						<svg className="w-5 h-5 md:w-8 md:h-8 text-white mb-1 md:mb-2" fill="currentColor" viewBox="0 0 24 24">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
						</svg>
						<span className="text-gray-300 font-medium text-[10px] md:text-sm">Follow on X</span>
					</a>

					{/* Buy a coffee (Rectángulo Inferior) */}
					<div className="col-span-2 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-3 md:p-6 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[5rem]">
						<div className="w-full max-w-xs md:max-w-sm mx-auto">
							<DonationButton />
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
			</div>
		</main>
	);
}
