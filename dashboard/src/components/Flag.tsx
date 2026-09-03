"use client";

import { clsx } from "clsx";
import { useState, useEffect } from "react";

type Props = {
	countryCode: string | undefined;
	className?: string;
};

export default function Flag({ countryCode, className }: Props) {
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		setHasError(false);
	}, [countryCode]);

	const hasCustomDimensions =
		className && (className.includes("h-") || className.includes("w-"));

	return (
		<div
			className={clsx(
				"relative overflow-hidden rounded-lg shrink-0 flex items-center justify-center",
				!hasCustomDimensions && "h-10 w-14",
				className
			)}
		>
			{countryCode && !hasError ? (
				<img
					src={`/country-flags/${countryCode.toLowerCase()}.svg`}
					alt={countryCode}
					className="w-full h-full object-cover block"
					onError={() => setHasError(true)}
				/>
			) : (
				<div className="h-full w-full overflow-hidden rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center">
					<span className="text-[10px] text-neutral-400 font-bold uppercase">
						{countryCode || "?"}
					</span>
				</div>
			)}
		</div>
	);
}
