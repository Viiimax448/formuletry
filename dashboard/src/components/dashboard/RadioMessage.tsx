import { useRef, useState } from "react";
import { motion } from "motion/react";
import { utc } from "moment";
import clsx from "clsx";

import type { Driver, RadioCapture } from "@/types/state.type";

import { useSettingsStore } from "@/stores/useSettingsStore";

import { toTrackTime } from "@/lib/toTrackTime";

import DriverTag from "@/components/driver/DriverTag";
import PlayControls from "@/components/ui/PlayControls";
import Progress from "@/components/ui/Progress";

type Props = {
	driver: Driver;
	capture: RadioCapture;
	basePath: string;
	gmtOffset: string;
};

export default function RadioMessage({ driver, capture, basePath, gmtOffset }: Props) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const [playing, setPlaying] = useState<boolean>(false);
	const [duration, setDuration] = useState<number>(10);
	const [progress, setProgress] = useState<number>(0);

	const loadMeta = () => {
		if (!audioRef.current) return;
		setDuration(audioRef.current.duration);
	};

	const onEnded = () => {
		setPlaying(false);
		setProgress(0);

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	const updateProgress = () => {
		if (!audioRef.current) return;
		setProgress(audioRef.current.currentTime);
	};

	const togglePlayback = () => {
		setPlaying((old) => {
			if (!audioRef.current) return old;

			if (!old) {
				audioRef.current.play();
				intervalRef.current = setInterval(updateProgress, 10);
			} else {
				audioRef.current.pause();

				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}

				setTimeout(() => {
					setProgress(0);
					audioRef.current?.fastSeek(0);
				}, 10000);
			}

			return !old;
		});
	};

	const favoriteDriver = useSettingsStore((state) => state.favoriteDrivers.includes(driver.RacingNumber));

	const localTime = utc(capture.Utc).local().format("HH:mm:ss");
	const trackTime = utc(toTrackTime(capture.Utc, gmtOffset)).format("HH:mm");

	return (
		<motion.li
			animate={{ opacity: 1, scale: 1 }}
			initial={{ opacity: 0, scale: 0.9 }}
			className={clsx(
				"rounded-xl border bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10",
				{ "border-blue-500/30 bg-blue-900/20": favoriteDriver, "border-white/10": !favoriteDriver }
			)}
		>
			<div className="mb-3 flex items-center gap-2 text-xs font-mono text-gray-400">
				<time dateTime={localTime} className="font-medium">
					{localTime}
				</time>
				<span className="text-gray-500">•</span>
				<time className="text-gray-500" dateTime={trackTime}>
					{trackTime}
				</time>
			</div>

			<div className="flex items-center gap-4">
				{/* Driver Badge */}
				<div className="flex items-center gap-2">
					<div
						className="rounded-full px-3 py-1.5 text-xs font-mono font-semibold text-white"
						style={{ backgroundColor: `#${driver.TeamColour}` }}
					>
						{driver.Tla}
					</div>
				</div>

				{/* Audio Controls */}
				<div className="flex flex-1 items-center gap-3">
					<PlayControls
						playing={playing}
						onClick={togglePlayback}
						className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
					/>
					<div className="flex-1">
						<Progress
							duration={duration}
							progress={progress}
							className="h-1 rounded-full bg-gray-700"
							accent={`#${driver.TeamColour}`}
						/>
					</div>
				</div>

				<audio
					preload="none"
					src={`${basePath}${capture.Path}`}
					ref={audioRef}
					onEnded={() => onEnded()}
					onLoadedMetadata={() => loadMeta()}
				/>
			</div>
		</motion.li>
	);
}
