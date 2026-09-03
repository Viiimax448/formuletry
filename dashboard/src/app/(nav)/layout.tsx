"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";
import DonationModal from "@/components/DonationModal";
import SupportFooter from "@/components/SupportFooter";
import { useDonationModal } from "@/hooks/useDonationModal";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	const donationModal = useDonationModal();

	return (
		<div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
			{/* Ambient Dynamic Background Lights */}
			<div className="absolute top-[0%] right-[-10%] md:right-[5%] w-72 md:w-[500px] h-72 md:h-[500px] bg-blue-500/10 blur-[90px] md:blur-[130px] rounded-full pointer-events-none animate-slow-glow" />
			<div
				className="absolute bottom-[10%] left-[-10%] md:left-[5%] w-64 md:w-[450px] h-64 md:h-[450px] bg-cyan-500/10 blur-[85px] md:blur-[120px] rounded-full pointer-events-none animate-slow-glow"
				style={{ animationDelay: "-4s" }}
			/>

			{/* Top Motorsport HUD Navigation Bar */}
			<header className="sticky top-0 left-0 z-40 w-full border-b border-neutral-800/80 bg-[#0a0a0a]/90 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-3.5">
				<div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
					{/* Left: Back to Home & Brand */}
					<Link
						href="/"
						prefetch={false}
						className="group flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors"
					>
						<div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 transition-all">
							<ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
						</div>
						<span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-white group-hover:text-cyan-400 transition-colors">
							FORMULETRY
						</span>
					</Link>

					{/* Right: Actions */}
					<div className="flex items-center">
						{/* Direct Dashboard CTA */}
						<Link
							href="/dashboard"
							prefetch={false}
							className="relative overflow-hidden bg-gradient-to-r from-[#0052ff] to-[#00a3e0] text-white font-bold text-xs sm:text-sm py-2 px-3.5 sm:px-4 rounded-xl uppercase tracking-wider shadow-md shadow-blue-500/15 hover:shadow-blue-500/25 hover:brightness-110 flex items-center gap-1.5 transition-all"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-sweep" />
							<Activity className="w-4 h-4 shrink-0" />
							<span className="relative z-10 hidden sm:inline">Launch Dashboard</span>
							<span className="relative z-10 sm:hidden">Dashboard</span>
						</Link>
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="relative z-10 px-4 sm:px-6 md:px-8 py-8 md:py-12 flex-1">
				<div className="max-w-7xl mx-auto">{children}</div>
			</main>

			{/* Footer */}
			<SupportFooter />

			{/* Donation Modal */}
			<DonationModal isOpen={donationModal.isOpen} onClose={donationModal.close} />
		</div>
	);
}
