"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { utc } from "moment";
import { Play, Pause, Radio } from "lucide-react";
import clsx from "clsx";

import type { Driver, RadioCapture } from "@/types/state.type";
import { toTrackTime } from "@/lib/toTrackTime";
import { getCustomTeamColor, getContrastColor } from "@/lib/teamColors";

type Props = {
	driver?: Driver;
	capture: RadioCapture;
	basePath: string;
	gmtOffset: string;
};

const formatAudioTime = (seconds: number) => {
	if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function RadioMessage({ driver, capture, basePath, gmtOffset }: Props) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const [playing, setPlaying] = useState<boolean>(false);
	const [duration, setDuration] = useState<number>(0);
	const [progress, setProgress] = useState<number>(0);
	const [playbackRate, setPlaybackRate] = useState<number>(1);

	const teamColor = getCustomTeamColor(driver?.TeamColour ?? "3B82F6", driver?.Tla);
	const badgeTextColor = getContrastColor(teamColor);
	const isDarkBadge = badgeTextColor === "#090d16";

	const loadMeta = () => {
		if (!audioRef.current) return;
		setDuration(audioRef.current.duration || 0);
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
				audioRef.current.playbackRate = playbackRate;
				audioRef.current.play().catch(() => {
					setPlaying(false);
				});
				intervalRef.current = setInterval(updateProgress, 50);
			} else {
				audioRef.current.pause();
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			}

			return !old;
		});
	};

	const cycleSpeed = () => {
		const nextSpeed = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
		setPlaybackRate(nextSpeed);
		if (audioRef.current) {
			audioRef.current.playbackRate = nextSpeed;
		}
	};

	const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!audioRef.current || !duration) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const clickPos = (e.clientX - rect.left) / rect.width;
		const targetTime = clickPos * duration;
		audioRef.current.currentTime = targetTime;
		setProgress(targetTime);
	};

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	const localTime = utc(capture.Utc).local().format("HH:mm:ss");
	const trackTime = utc(toTrackTime(capture.Utc, gmtOffset)).format("HH:mm");
	const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

	return (
		<motion.li
			layout="position"
			animate={{ opacity: 1, y: 0, scale: 1 }}
			initial={{ opacity: 0, y: 4, scale: 0.98 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className="group relative list-none rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] border-l-2 px-2.5 py-2 transition-colors duration-150"
			style={{ borderLeftColor: teamColor }}
		>
			{/* Top Metadata Line */}
			<div className="mb-1.5 flex items-center justify-between text-[11px] font-mono">
				<div className="flex items-center gap-1.5 text-gray-400">
					<Radio className="w-3 h-3 text-gray-400" />
					<time dateTime={localTime} className="font-semibold text-gray-300">
						{localTime}
					</time>
					<span className="text-gray-600">•</span>
					<time className="text-gray-500 text-[10px]" dateTime={trackTime}>
						{trackTime}
					</time>
				</div>

				{driver && (
					<span className="truncate text-[10px] font-sans font-medium text-gray-300 max-w-[140px]">
						{driver.BroadcastName ?? driver.FullName}
					</span>
				)}
			</div>

			{/* Main Audio Player Controls */}
			<div className="flex items-center gap-2.5">
				{/* Driver Badge with auto contrast */}
				<div
					className={clsx(
						"rounded px-2 py-0.5 text-[10px] font-mono font-bold shadow-sm flex items-center gap-1 shrink-0 border",
						isDarkBadge ? "border-black/20" : "border-white/20",
					)}
					style={{ backgroundColor: teamColor, color: badgeTextColor }}
				>
					<span>#{driver?.RacingNumber ?? capture.RacingNumber}</span>
					{driver?.Tla && <span>{driver.Tla}</span>}
				</div>

				{/* Play / Pause Circular Button */}
				<button
					onClick={togglePlayback}
					className={clsx(
						"flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-150",
						playing
							? "bg-white text-black"
							: "bg-white/10 text-white hover:bg-white/20",
					)}
					title={playing ? "Pausar audio" : "Reproducir audio"}
				>
					{playing ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
				</button>

				{/* Animated Equalizer Waveform Indicator */}
				<div className="flex items-end gap-0.5 h-3.5 w-4 shrink-0 justify-center">
					<div
						className={clsx(
							"w-0.5 rounded-full transition-all",
							playing ? "bg-gray-300 animate-eq-1" : "h-1 bg-gray-600",
						)}
					/>
					<div
						className={clsx(
							"w-0.5 rounded-full transition-all",
							playing ? "bg-gray-300 animate-eq-2" : "h-1.5 bg-gray-600",
						)}
					/>
					<div
						className={clsx(
							"w-0.5 rounded-full transition-all",
							playing ? "bg-gray-300 animate-eq-3" : "h-2 bg-gray-600",
						)}
					/>
					<div
						className={clsx(
							"w-0.5 rounded-full transition-all",
							playing ? "bg-gray-300 animate-eq-4" : "h-1 bg-gray-600",
						)}
					/>
				</div>

				{/* Interactive Progress Bar + Timers */}
				<div className="flex flex-1 flex-col gap-0.5 min-w-0">
					<div
						onClick={handleSeek}
						className="relative h-1.5 w-full cursor-pointer rounded-full bg-gray-800 overflow-hidden"
					>
						<div
							className="absolute left-0 top-0 h-full rounded-full transition-all"
							style={{
								width: `${progressPercent}%`,
								backgroundColor: teamColor,
							}}
						/>
					</div>

					<div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
						<span>{formatAudioTime(progress)}</span>
						<span>{formatAudioTime(duration)}</span>
					</div>
				</div>

				{/* Playback Speed Pill */}
				<button
					onClick={cycleSpeed}
					className="rounded bg-white/5 border border-white/10 px-1.5 py-0.2 text-[9px] font-mono font-medium text-gray-300 hover:bg-white/15 hover:text-white transition-colors shrink-0"
					title="Cambiar velocidad de reproducción"
				>
					{playbackRate}x
				</button>

				<audio
					preload="none"
					src={`${basePath}${capture.Path}`}
					ref={audioRef}
					onEnded={onEnded}
					onLoadedMetadata={loadMeta}
				/>
			</div>
		</motion.li>
	);
}
