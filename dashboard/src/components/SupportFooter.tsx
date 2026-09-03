"use client";

import Link from "next/link";
import { useDonationModal } from "@/hooks/useDonationModal";

export default function SupportFooter() {
	const donationModal = useDonationModal();

	return (
		<footer className="relative z-10 border-t border-neutral-800/80 bg-[#0a0a0a] px-5 md:px-6 py-6 md:py-8 text-center space-y-3.5 mt-auto">
			<div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-3">
				{/* Legal Navigation Links */}
				<div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-1.5 text-[11px] md:text-sm text-neutral-400 font-medium">
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

				{/* Platform Details & AGPL License */}
				<p className="text-[10px] md:text-xs text-neutral-500 leading-relaxed max-w-2xl mx-auto">
					Professional F1 Telemetry & Timing ·{" "}
					<span className="text-white font-bold">FORMULETRY</span> · Based on{" "}
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

				{/* F1 Legal Disclaimer */}
				<p className="text-[9px] md:text-xs text-neutral-600 leading-relaxed max-w-xl mx-auto">
					This project is unofficial and is not associated in any way with the Formula 1 companies.
					F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related
					marks are trademarks of Formula One Licensing B.V.
				</p>
			</div>
		</footer>
	);
}
