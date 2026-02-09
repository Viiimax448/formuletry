"use client";

import { Fragment } from "react";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export default function DonationModal({ isOpen, onClose }: Props) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			{/* Backdrop */}
			<div className="flex min-h-full items-center justify-center p-4">
				<div 
					className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
					onClick={onClose}
				/>
				
				{/* Modal */}
				<div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-card border border-white/10 p-8 shadow-2xl transition-all">
					{/* Close Button */}
					<button
						onClick={onClose}
						className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>

					{/* Content */}
					<div className="text-center">
						<h3 className="text-2xl font-bold font-sans text-white mb-2">
							Support the Project 🚀
						</h3>
						<p className="text-gray-300 font-medium mb-8">
							Servers are not free! Help us keep the data live.
						</p>

						{/* Donation Options */}
						<div className="space-y-4">
							{/* Argentina Option */}
							<a
								href="https://cafecito.app/formuletry"
								target="_blank"
								rel="noopener noreferrer"
								className="group block w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6 transition-all duration-300 hover:scale-105 hover:border-cyan-400 hover:bg-cyan-500/20"
							>
								<div className="flex items-center justify-center space-x-3">
									<span className="text-3xl">🇦🇷</span>
									<div className="text-left">
										<h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
											Cafecito
										</h4>
										<p className="text-sm text-gray-400">
											MercadoPago / ARS
										</p>
									</div>
								</div>
							</a>

							{/* International Option */}
							<a
								href="https://www.buymeacoffee.com/formuletry"
								target="_blank"
								rel="noopener noreferrer"
								className="group block w-full rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6 transition-all duration-300 hover:scale-105 hover:border-yellow-400 hover:bg-yellow-500/20"
							>
								<div className="flex items-center justify-center space-x-3">
									<span className="text-3xl">🌍</span>
									<div className="text-left">
										<h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
											Buy Me a Coffee
										</h4>
										<p className="text-sm text-gray-400">
											PayPal / USD
										</p>
									</div>
								</div>
							</a>
						</div>

						{/* Thank You Message */}
						<p className="text-xs text-gray-500 mt-6">
							Every contribution helps keep Formuletry running 24/7
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}