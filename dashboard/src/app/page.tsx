"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
	Activity,
	Calendar,
	CloudRain,
	Trophy,
	Megaphone,
	ChevronRight,
	MapPin
} from "lucide-react";
import { getNextEvent } from "@/data/f1-calendar";
import type { Round } from "@/types/schedule.type";
import Flag from "@/components/Flag";
import InstallButton from "@/components/InstallButton";
import DonationModal from "@/components/DonationModal";
import { useDonationModal } from "@/hooks/useDonationModal";

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

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.02,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 380,
			damping: 26,
		},
	},
};

function formatEventDates(event: Round): string {
	try {
		const startDate = new Date(event.start);
		const endDate = new Date(event.end);
		const startMonth = startDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
		const startDay = startDate.getUTCDate();
		const endDay = endDate.getUTCDate();
		return `${startMonth} ${startDay} - ${endDay}`;
	} catch {
		return "2026 SEASON";
	}
}

function cleanGrandPrixName(name: string): string {
	return name
		.replace(/2026/g, "")
		.replace(/FORMULA 1/gi, "")
		.replace(/GRAND PRIX/gi, "GP")
		.replace(/GRAN PREMIO DE LA/gi, "GP")
		.replace(/GRAN PREMIO DE/gi, "GP")
		.replace(/GRAN PREMIO/gi, "GP")
		.replace(/GRANDE PRÊMIO DE/gi, "GP")
		.trim();
}

export default function Home() {
	const [nextEvent, setNextEvent] = useState<Round | undefined>(undefined);
	const [isLive, setIsLive] = useState(false);
	const donationModal = useDonationModal();

	useEffect(() => {
		const ev = getNextEvent();
		setNextEvent(ev);
		if (ev) {
			const now = new Date();
			const start = new Date(ev.start);
			const end = new Date(ev.end);
			setIsLive(now >= start && now <= end);
		}
	}, []);

	const eventCountry = nextEvent?.countryName || "Netherlands";
	const countryCode = countryCodeMap[eventCountry] || "ned";
	const eventDates = nextEvent ? formatEventDates(nextEvent) : "AUG 21 - 23";
	const rawName = nextEvent?.name || "DUTCH GRAND PRIX 2026";
	const eventTitle = cleanGrandPrixName(rawName);

	return (
		<div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
			{/* Ambient Dynamic Background Lights */}
			<div className="absolute top-[0%] right-[-10%] md:right-[5%] w-72 md:w-[500px] h-72 md:h-[500px] bg-blue-500/10 blur-[90px] md:blur-[130px] rounded-full pointer-events-none animate-slow-glow" />
			<div
				className="absolute bottom-[10%] left-[-10%] md:left-[5%] w-64 md:w-[450px] h-64 md:h-[450px] bg-cyan-500/10 blur-[85px] md:blur-[120px] rounded-full pointer-events-none animate-slow-glow"
				style={{ animationDelay: "-4s" }}
			/>

			{/* Main Content: Preserves the exact Mobile App Frame on small devices, expands to Full Widescreen on PC */}
			<main className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto min-h-screen bg-[#0a0a0a] border-x-2 border-neutral-800 md:border-x-0 shadow-2xl md:shadow-none px-4 sm:px-6 md:px-8 pt-6 md:pt-12 pb-12 space-y-5 md:space-y-8 relative z-10 flex-1">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="space-y-5 md:space-y-7"
				>
					{/* Brand Title & Header Section */}
					<motion.div variants={itemVariants} className="text-center pt-2 pb-1">
						<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono mb-2 md:mb-3 shadow-xs">
							<span>F1 2026 SEASON</span>
						</div>
						<h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold uppercase tracking-[0.25em] md:tracking-[0.3em] text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)] leading-tight">
							FORMULETRY
						</h1>
						<div className="w-20 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-2 md:mt-3" />
						<p className="text-[10px] sm:text-xs md:text-base text-neutral-400 font-medium max-w-xl mx-auto mt-2 md:mt-3 leading-relaxed">
							Real-Time Timing Data, Advanced Analytics & Live Race Telemetry
						</p>
					</motion.div>

					{/* Hero & Actions: Stacked on Mobile, Split 2-Column on Desktop */}
					<motion.div
						variants={itemVariants}
						className="grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-5 items-stretch"
					>
						{/* Next Event Hero Card */}
						<div className="md:col-span-7 lg:col-span-8">
							<Link href="/dashboard" prefetch={false} className="block group h-full">
								<div className="rounded-3xl bg-[#1a1a1a] border border-neutral-800 hover:border-neutral-700 h-52 sm:h-60 md:h-full min-h-[210px] md:min-h-[240px] overflow-hidden relative flex flex-col justify-between p-5 md:p-7 shadow-xl shadow-black/40 cursor-pointer transition-all duration-300">
									{/* Dark Gradient Overlay & Subtle HUD Grid */}
									<div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/75 to-transparent z-10 pointer-events-none" />
									<div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px] opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none" />

									{/* Top Header of Hero Card */}
									<div className="relative z-20 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="flex h-2.5 w-2.5 relative">
												<span
													className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
														isLive ? "bg-red-400" : "bg-cyan-400"
													} opacity-75`}
												/>
												<span
													className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
														isLive
															? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]"
															: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]"
													}`}
												/>
											</span>
											<span
												className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${
													isLive ? "text-red-400" : "text-cyan-400"
												}`}
											>
												{isLive ? "LIVE GP SESSION" : "NEXT GRAND PRIX"}
											</span>
										</div>
										<span className="text-[10px] md:text-xs font-mono font-bold text-neutral-300 bg-neutral-900/90 border border-neutral-800 px-2.5 md:px-3 py-0.5 md:py-1 rounded-full shadow-inner">
											{eventDates}
										</span>
									</div>

									{/* Bottom Details of Hero Card */}
									<div className="relative z-20 flex items-end justify-between gap-4">
										<div className="space-y-1 min-w-0">
											<p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">
												{eventCountry}
											</p>
											<h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
												{eventTitle}
											</h3>
										</div>
										<Flag
											countryCode={countryCode}
											className="h-10 sm:h-12 md:h-14 w-14 sm:w-16 md:w-20 rounded-xl shadow-lg border border-neutral-700/60 object-cover group-hover:scale-105 transition-transform shrink-0"
										/>
									</div>
								</div>
							</Link>
						</div>

						{/* Actions: Side-by-side row on Mobile, Column on Desktop */}
						<div className="md:col-span-5 lg:col-span-4 flex flex-row md:flex-col items-stretch gap-3 justify-between">
							<Link href="/dashboard" prefetch={false} className="flex-1">
								<motion.button
									whileHover={{ y: -3, scale: 1.012 }}
									whileTap={{ scale: 0.98 }}
									transition={{ type: "spring", stiffness: 400, damping: 25 }}
									className="w-full h-full min-h-[52px] md:min-h-[140px] relative overflow-hidden bg-gradient-to-r from-[#0052ff] to-[#00a3e0] text-white font-bold text-sm sm:text-base md:text-lg py-4 px-4 md:px-6 rounded-xl md:rounded-2xl uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:brightness-110 flex md:flex-col items-center justify-center gap-2 md:gap-2.5 cursor-pointer"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-sweep" />
									<Activity className="w-5 h-5 md:w-8 md:h-8 text-white shrink-0 group-hover:scale-110 transition-transform" />
									<span className="relative z-10 font-extrabold tracking-wider text-center">
										LAUNCH DASHBOARD
									</span>
								</motion.button>
							</Link>

							<div className="w-[88px] md:w-full shrink-0">
								<InstallButton />
							</div>
						</div>
					</motion.div>

					{/* Sponsor / AD Banner */}
					<motion.div variants={itemVariants}>
						<a
							href="https://twitter.com/formuletry"
							target="_blank"
							rel="noopener noreferrer"
							className="block group"
						>
							<div className="rounded-xl md:rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 hover:bg-neutral-900/60 p-3.5 md:p-4.5 transition-all flex items-center justify-between gap-3 md:gap-4 shadow-md shadow-black/20">
								<div className="flex items-center gap-3 md:gap-3.5 min-w-0">
									<div className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-cyan-400 group-hover:scale-105 transition-transform">
										<Megaphone className="w-4 h-4 md:w-5 md:h-5" />
									</div>
									<div className="min-w-0 text-left">
										<div className="flex items-center gap-2">
											<h4 className="text-xs md:text-base font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
												Tu marca en Formuletry
											</h4>
											<span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 md:px-2 py-0.2 md:py-0.5 rounded tracking-wider">
												AD
											</span>
										</div>
										<p className="text-[11px] md:text-sm text-neutral-400 truncate">
											Conecta con miles de fanáticos del motorsport
										</p>
									</div>
								</div>
								<ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
							</div>
						</a>
					</motion.div>

					{/* Bento Navigation Grid (2 cols on Mobile, 4 cols on Desktop) */}
					<motion.div
						variants={itemVariants}
						className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
					>
						{/* Race Calendar */}
						<Link href="/schedule" prefetch={false} className="group">
							<motion.div
								whileHover={{ y: -2, scale: 1.015 }}
								whileTap={{ scale: 0.985 }}
								transition={{ type: "spring", stiffness: 400, damping: 25 }}
								className="rounded-xl md:rounded-2xl p-4 md:p-5 border border-neutral-900 md:border-neutral-800/80 bg-neutral-950 hover:border-neutral-800 md:hover:border-neutral-700 text-neutral-200 transition-all flex flex-col justify-between shadow-md shadow-black/30 min-h-[110px] md:min-h-[135px]"
							>
								<div className="flex items-center justify-between">
									<Calendar className="w-6 h-6 md:w-7 md:h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
									<ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-cyan-400 transition-colors" />
								</div>
								<div className="mt-2.5 md:mt-3 text-left">
									<h4 className="font-extrabold text-sm md:text-base text-white group-hover:text-cyan-400 transition-colors leading-tight">
										Race Calendar
									</h4>
									<span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">
										2026 Schedule
									</span>
								</div>
							</motion.div>
						</Link>

						{/* Race Weather */}
						<Link href="/weather?from=home" prefetch={false} className="group">
							<motion.div
								whileHover={{ y: -2, scale: 1.015 }}
								whileTap={{ scale: 0.985 }}
								transition={{ type: "spring", stiffness: 400, damping: 25 }}
								className="rounded-xl md:rounded-2xl p-4 md:p-5 border border-neutral-900 md:border-neutral-800/80 bg-neutral-950 hover:border-neutral-800 md:hover:border-neutral-700 text-neutral-200 transition-all flex flex-col justify-between shadow-md shadow-black/30 min-h-[110px] md:min-h-[135px]"
							>
								<div className="flex items-center justify-between">
									<CloudRain className="w-6 h-6 md:w-7 md:h-7 text-blue-400 group-hover:scale-110 transition-transform" />
									<ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-blue-400 transition-colors" />
								</div>
								<div className="mt-2.5 md:mt-3 text-left">
									<h4 className="font-extrabold text-sm md:text-base text-white group-hover:text-blue-400 transition-colors leading-tight">
										Race Weather
									</h4>
									<span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">
										Track Doppler
									</span>
								</div>
							</motion.div>
						</Link>

						{/* Track Maps (Disabled / Coming Soon) */}
						<div className="rounded-xl md:rounded-2xl p-4 md:p-5 border border-neutral-900 bg-neutral-950/40 text-neutral-500 opacity-60 cursor-not-allowed select-none flex flex-col justify-between shadow-inner min-h-[110px] md:min-h-[135px] relative overflow-hidden">
							<div className="flex items-center justify-between">
								<MapPin className="w-6 h-6 md:w-7 md:h-7 text-neutral-500" />
								<span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900/90 border border-neutral-800 px-1.5 md:px-2 py-0.5 rounded">
									SOON
								</span>
							</div>
							<div className="mt-2.5 md:mt-3 text-left">
								<h4 className="font-extrabold text-sm md:text-base text-neutral-400 leading-tight">
									Track Map
								</h4>
								<span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-600">
									GPS & Sectors
								</span>
							</div>
						</div>

						{/* Standings (Disabled / Coming Soon) */}
						<div className="rounded-xl md:rounded-2xl p-4 md:p-5 border border-neutral-900 bg-neutral-950/40 text-neutral-500 opacity-60 cursor-not-allowed select-none flex flex-col justify-between shadow-inner min-h-[110px] md:min-h-[135px] relative overflow-hidden">
							<div className="flex items-center justify-between">
								<Trophy className="w-6 h-6 md:w-7 md:h-7 text-neutral-500" />
								<span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900/90 border border-neutral-800 px-1.5 md:px-2 py-0.5 rounded">
									SOON
								</span>
							</div>
							<div className="mt-2.5 md:mt-3 text-left">
								<h4 className="font-extrabold text-sm md:text-base text-neutral-400 leading-tight">
									Standings
								</h4>
								<span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-600">
									Championship
								</span>
							</div>
						</div>
					</motion.div>

					{/* Secondary Actions & Social Links */}
					<motion.div variants={itemVariants} className="pt-2">
						<div className="flex items-center justify-center gap-3 md:gap-4">
							{/* Twitter / X */}
							<a
								href="https://twitter.com/formuletry"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 md:p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-colors shadow-md shadow-black/40 cursor-pointer"
								title="Follow on X"
							>
								<svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>

							{/* Instagram */}
							<a
								href="https://instagram.com/formuletry"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 md:p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-pink-400 hover:bg-neutral-800 hover:border-neutral-700 transition-colors shadow-md shadow-black/40 cursor-pointer"
								title="Follow on Instagram"
							>
								<svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
								</svg>
							</a>

							{/* Support / Donate */}
							<button
								onClick={() => donationModal.open()}
								className="px-4 md:px-5 py-2.5 md:py-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-pink-400 hover:bg-neutral-800 hover:border-neutral-700 transition-colors shadow-md shadow-black/40 flex items-center gap-1.5 md:gap-2 cursor-pointer text-xs md:text-sm font-bold"
							>
								<span>Support Formuletry</span>
								<span>❤️</span>
							</button>
						</div>
					</motion.div>

					{/* SEO & Platform Features Section */}
					<motion.div variants={itemVariants} className="pt-4 md:pt-6 space-y-3 md:space-y-4">
						<h2 className="text-[10px] md:text-sm font-bold uppercase tracking-[0.25em] text-neutral-500 text-center">
							What is Formuletry?
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-left">
							<div className="rounded-2xl bg-[#141414] border border-neutral-800/80 p-4 md:p-6 space-y-1 md:space-y-2">
								<h3 className="text-xs md:text-sm font-bold text-cyan-400 uppercase tracking-wide">
									Free Live Timing
								</h3>
								<p className="text-[11px] md:text-sm text-neutral-400 leading-relaxed">
									Real-time timing data for Formula 1 fans. Track every lap, sector, and
									mini-sector with high-precision telemetry wherever you are.
								</p>
							</div>

							<div className="rounded-2xl bg-[#141414] border border-neutral-800/80 p-4 md:p-6 space-y-1 md:space-y-2">
								<h3 className="text-xs md:text-sm font-bold text-blue-400 uppercase tracking-wide">
									Live Dashboard & Analysis
								</h3>
								<p className="text-[11px] md:text-sm text-neutral-400 leading-relaxed">
									Access speed traps, tire degradation, throttle traces, and team radios
									live during Grand Prix sessions with an intuitive HUD interface.
								</p>
							</div>

							<div className="rounded-2xl bg-[#141414] border border-neutral-800/80 p-4 md:p-6 space-y-1 md:space-y-2">
								<h3 className="text-xs md:text-sm font-bold text-neutral-200 uppercase tracking-wide">
									Community Powered
								</h3>
								<p className="text-[11px] md:text-sm text-neutral-400 leading-relaxed">
									Crafted by and for motorsport enthusiasts. Free, fast, and open source
									platform designed for the ultimate race day experience.
								</p>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</main>

			{/* Full Width Footer */}
			<footer className="relative z-10 border-t border-neutral-800/80 bg-[#0a0a0a] px-5 md:px-6 py-6 md:py-10 text-center space-y-3 md:space-y-4">
				<div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-1.5 md:gap-y-2 text-[11px] md:text-sm text-neutral-400 font-medium">
					<Link href="/privacy" className="hover:text-cyan-400 transition-colors">
						Privacy Policy
					</Link>
					<span className="text-neutral-700">·</span>
					<Link href="/terms" className="hover:text-cyan-400 transition-colors">
						Terms of Service
					</Link>
					<span className="text-neutral-700">·</span>
					<Link href="/about" className="hover:text-cyan-400 transition-colors">
						About Us
					</Link>
					<span className="text-neutral-700">·</span>
					<Link href="/contact" className="hover:text-cyan-400 transition-colors">
						Contact
					</Link>
				</div>

				<p className="text-[10px] md:text-xs text-neutral-500 leading-relaxed max-w-2xl mx-auto">
					Based on{" "}
					<a
						href="https://github.com/slowlydev/f1-dash"
						target="_blank"
						rel="noopener noreferrer"
						className="text-neutral-400 hover:text-cyan-400 transition-colors underline underline-offset-2"
					>
						f1-dash
					</a>{" "}
					· Licensed under{" "}
					<a
						href="https://www.gnu.org/licenses/agpl-3.0.html"
						target="_blank"
						rel="noopener noreferrer"
						className="text-neutral-400 hover:text-cyan-400 transition-colors"
					>
						GNU AGPL v3
					</a>{" "}
					·{" "}
					<a
						href="https://github.com/Viiimax/formuletry"
						target="_blank"
						rel="noopener noreferrer"
						className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
					>
						View Source Code
					</a>
				</p>

				<p className="text-[9px] md:text-xs text-neutral-600 leading-relaxed max-w-xl mx-auto">
					This project is unofficial and is not associated in any way with the Formula 1 companies.
					F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related
					marks are trademarks of Formula One Licensing B.V.
				</p>
			</footer>

			{/* Donation Modal Portal */}
			<DonationModal isOpen={donationModal.isOpen} onClose={donationModal.close} />
		</div>
	);
}
