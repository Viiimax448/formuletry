"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import DonationModal from "@/components/DonationModal";
import SupportFooter from "@/components/SupportFooter";
import { useDonationModal } from "@/hooks/useDonationModal";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	const donationModal = useDonationModal();

	return (
		<>
			<nav className="sticky top-0 left-0 z-10 flex h-16 w-full items-center justify-between gap-4 border-b border-white/10 bg-deep-slate/90 backdrop-blur-xl px-6">
				<div className="flex gap-6">
					<Link className="font-medium text-gray-300 transition-colors duration-200 hover:text-white active:scale-95" href="/">
						Home
					</Link>
					<Link className="font-medium text-gray-300 transition-colors duration-200 hover:text-white active:scale-95" href="/dashboard">
						Dashboard
					</Link>
					<Link className="font-medium text-gray-300 transition-colors duration-200 hover:text-white active:scale-95" href="/schedule">
						Schedule
					</Link>
					<Link className="font-medium text-gray-300 transition-colors duration-200 hover:text-white active:scale-95" href="/help">
						Help
					</Link>
				</div>

				{/* Right Side - Support & Social */}
				<div className="flex items-center gap-4">
					{/* Support Button */}
					<button
						onClick={donationModal.open}
						className="flex items-center gap-2 rounded-lg border border-pink-500/30 bg-pink-500/10 px-3 py-2 font-medium text-pink-400 transition-all duration-200 hover:border-pink-400 hover:bg-pink-500/20 hover:text-pink-300 active:scale-95"
					>
						<span>Support</span>
						<span>❤️</span>
					</button>

					{/* Twitter Link */}
					<Link
						href="https://x.com/MaximoLXXXI"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-white/10 hover:text-white active:scale-95"
						title="Follow on X (Twitter)"
					>
						<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
						</svg>
					</Link>
				</div>
			</nav>

			<main className="min-h-screen bg-deep-slate px-6 py-8">
				<div className="container mx-auto max-w-7xl">
					{children}
				</div>
			</main>

			{/* Footer */}
			<SupportFooter />

			{/* Donation Modal */}
			<DonationModal 
				isOpen={donationModal.isOpen} 
				onClose={donationModal.close} 
			/>
		</>
	);
}
