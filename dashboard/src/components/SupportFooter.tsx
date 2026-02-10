"use client";

import { useDonationModal } from "@/hooks/useDonationModal";

export default function SupportFooter() {
	const donationModal = useDonationModal();

	const handleSupportClick = () => {
		donationModal.open();
	};

	return (
		<footer className="mt-16 border-t border-white/10 bg-deep-slate py-8">
			<div className="mx-auto max-w-7xl px-6">
				<div className="flex flex-col items-center justify-center gap-4 text-center">
					{/* Support Button */}
					<button
						onClick={handleSupportClick}
						type="button"
						className="relative z-10 cursor-pointer flex items-center gap-2 rounded-lg border border-pink-500/30 bg-pink-500/10 px-4 py-2 font-medium text-pink-400 transition-all duration-200 hover:border-pink-400 hover:bg-pink-500/20 hover:text-pink-300 hover:scale-105 active:scale-95"
					>
						<span>Support Formuletry</span>
						<span>❤️</span>
					</button>
					
					<p className="text-sm text-gray-500">
						Professional F1 telemetry platform · Real-time data analysis · 
						<span className="text-blue-400 font-medium"> Formuletry</span>
					</p>

					<p className="text-xs text-gray-600">
						This project is unofficial and is not associated in any way with the Formula 1 companies. 
						F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trademarks of Formula One Licensing B.V.
					</p>
				</div>
			</div>
		</footer>
	);
}