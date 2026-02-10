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
				<div className="flex">
					<Link className="font-medium text-gray-300 transition-colors duration-200 hover:text-white active:scale-95" href="/">
						Home
					</Link>
				</div>

				{/* Right Side - Support Only */}
				<div className="flex items-center">
					{/* Support Button */}
					<button
						onClick={donationModal.open}
						className="flex items-center gap-2 rounded-lg border border-pink-500/30 bg-pink-500/10 px-3 py-2 font-medium text-pink-400 transition-all duration-200 hover:border-pink-400 hover:bg-pink-500/20 hover:text-pink-300 active:scale-95"
					>
						<span>Support</span>
						<span>❤️</span>
					</button>
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
