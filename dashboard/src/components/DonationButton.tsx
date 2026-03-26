"use client";

import { useDonationModal } from "@/hooks/useDonationModal";
import DonationModal from "@/components/DonationModal";

export default function DonationButton() {
	const donationModal = useDonationModal();

	return (
		<>
			<button 
				onClick={() => donationModal.open()} 
				className="group inline-flex w-full items-center justify-center gap-2 px-2 py-3 md:px-5 rounded-xl bg-transparent text-gray-300 font-medium"
			>
				<svg className="w-4 h-4 md:w-5 md:h-5 text-pink-400 group-hover:scale-110 transition-transform shrink-0" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
				</svg>
				<span className="text-xs md:text-sm tracking-wide truncate">Donate $1</span>
			</button>
			<DonationModal 
				isOpen={donationModal.isOpen} 
				onClose={donationModal.close} 
			/>
		</>
	);
}