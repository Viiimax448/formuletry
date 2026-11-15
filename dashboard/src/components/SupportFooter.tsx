"use client";

export default function SupportFooter() {
	return (
		<footer className="w-full py-6 px-4 mt-auto border-t border-white/[0.06] bg-transparent text-center select-none">
			<div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-2">
				{/* AGPL License & View Source Code */}
				<p className="text-xs sm:text-[13px] text-neutral-400">
					Based on{" "}
					<a
						href="https://github.com/slowlydev/f1-dash"
						target="_blank"
						rel="noopener noreferrer"
						className="text-white hover:text-cyan-400 underline underline-offset-2 transition-colors font-medium"
					>
						f1-dash
					</a>{" "}
					· Licensed under{" "}
					<a
						href="https://www.gnu.org/licenses/agpl-3.0.html"
						target="_blank"
						rel="noopener noreferrer"
						className="text-neutral-300 hover:text-cyan-400 transition-colors font-medium"
					>
						GNU AGPL v3
					</a>{" "}
					·{" "}
					<a
						href="https://github.com/Viiimax/formuletry"
						target="_blank"
						rel="noopener noreferrer"
						className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
					>
						View Source Code
					</a>
				</p>

				{/* F1 Legal Disclaimer */}
				<p className="text-[10.5px] sm:text-xs text-neutral-500 max-w-2xl leading-relaxed">
					This project is unofficial and is not associated in any way with the Formula 1 companies.
					F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related
					marks are trademarks of Formula One Licensing B.V.
				</p>
			</div>
		</footer>
	);
}
