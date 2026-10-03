import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Zap } from "lucide-react";

import type { PositionCar, TimingDataDriver } from "@/types/state.type";
import type { Map as MapType, TrackPosition } from "@/types/map.type";

import { fetchMap } from "@/lib/fetchMap";
import { useDataStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";
import { getComparisonColors } from "@/lib/teamColors";
import { parseTimeToSeconds } from "@/lib/timingComparison";
import {
	createSectors,
	findYellowSectors,
	getSectorColor,
	type MapSector,
	prioritizeColoredSectors,
	rad,
	rotate,
} from "@/lib/map";

const ROTATION_FIX = 0;

// Function to calculate driver position based on their sector and segment progress
function getDriverPosition(
	timingDriver: TimingDataDriver | undefined,
	originalTrackPoints: { x: number; y: number }[] | null,
	splitIndices: [number, number] = [190, 433],
): PositionCar | null {
	if (!timingDriver || !originalTrackPoints || originalTrackPoints.length === 0) {
		return null;
	}

	const totalPoints = originalTrackPoints.length;
	const s1End = Math.min(splitIndices[0], totalPoints - 1);
	const s2End = Math.min(splitIndices[1], totalPoints - 1);

	// Sector point ranges: S1 -> [0, s1End], S2 -> [s1End, s2End], S3 -> [s2End, totalPoints - 1]
	const sectorRanges: [number, number][] = [
		[0, s1End],
		[s1End, s2End],
		[s2End, totalPoints - 1],
	];

	// Find the furthest sector and segment that has active or completed progress
	let activeSectorIdx = -1;
	let activeSegmentIdx = -1;
	let activeStatus = 0;

	if (timingDriver.Sectors && timingDriver.Sectors.length > 0) {
		for (let s = timingDriver.Sectors.length - 1; s >= 0; s--) {
			const sec = timingDriver.Sectors[s];
			const segs = sec.Segments || [];
			for (let i = segs.length - 1; i >= 0; i--) {
				const st = segs[i]?.Status;
				if (st !== undefined && st > 0) {
					activeSectorIdx = s;
					activeSegmentIdx = i;
					activeStatus = st;
					break;
				}
			}
			if (activeSectorIdx !== -1) break;
		}
	}

	if (activeSectorIdx === -1) {
		// Fallback to start
		return {
			Status: "OnTrack",
			X: originalTrackPoints[0].x,
			Y: originalTrackPoints[0].y,
			Z: 0,
		};
	}

	const safeSectorIdx = Math.min(Math.max(activeSectorIdx, 0), sectorRanges.length - 1);
	const [rangeStart, rangeEnd] = sectorRanges[safeSectorIdx];
	const totalSegmentsInSector = Math.max(timingDriver.Sectors[safeSectorIdx]?.Segments?.length || 1, 1);

	const baseRatio = activeSegmentIdx / totalSegmentsInSector;
	const segmentProgress = activeStatus === 1 ? 0.5 : 0;
	const segmentSize = 1 / totalSegmentsInSector;
	const adjustedRatio = Math.min(Math.max(baseRatio + segmentProgress * segmentSize, 0), 1);

	const positionIndex = Math.floor(rangeStart + adjustedRatio * (rangeEnd - rangeStart));
	const safeIndex = Math.min(Math.max(positionIndex, 0), totalPoints - 1);
	const trackPoint = originalTrackPoints[safeIndex];

	return {
		Status: "OnTrack",
		X: trackPoint.x,
		Y: trackPoint.y,
		Z: 0,
	};
}

type Corner = {
	number: number;
	pos: TrackPosition;
	labelPos: TrackPosition;
};

type Props = {
	filter?: string[];
};

export default function Map({ filter }: Props) {
	const showCornerNumbers = useSettingsStore((state) => state.showCornerNumbers);
	const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);
	const circuitOverride = useSettingsStore((state) => state.circuitOverride);
	const comparisonMode = useSettingsStore((state) => state.comparisonMode);

	const drivers = useDataStore((state) => state?.state?.DriverList);
	const trackStatus = useDataStore((state) => state?.state?.TrackStatus);
	const timingDrivers = useDataStore((state) => state?.state?.TimingData);
	const timingStats = useDataStore((state) => state?.state?.TimingStats);
	const bestLapSegments = useDataStore((state) => state.bestLapSegments);
	const raceControlMessages = useDataStore((state) => state?.state?.RaceControlMessages?.Messages ?? undefined);
	const circuitKey = useDataStore((state) => state?.state?.SessionInfo?.Meeting.Circuit.Key);
	const circuitShortName = useDataStore((state) => state?.state?.SessionInfo?.Meeting.Circuit.ShortName);
	const meetingName = useDataStore((state) => state?.state?.SessionInfo?.Meeting.Name);

	const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>([null, null, null, null]);
	const [[centerX, centerY], setCenter] = useState<(null | number)[]>([null, null]);

	const [points, setPoints] = useState<null | { x: number; y: number }[]>(null);
	const [sectors, setSectors] = useState<MapSector[]>([]);
	const [corners, setCorners] = useState<Corner[]>([]);
	const [rotation, setRotation] = useState<number>(0);
	const [finishLine, setFinishLine] = useState<null | { x: number; y: number; startAngle: number }>(null);
	const [originalTrackPoints, setOriginalTrackPoints] = useState<null | { x: number; y: number }[]>(null);

	useEffect(() => {
		let isMounted = true;

		const updateMap = async () => {
			const targetKey = circuitKey || circuitShortName || meetingName || 999;
			const mapJson = await fetchMap(targetKey, circuitOverride);

			if (!mapJson || !isMounted) return;

			const centerX = (Math.max(...mapJson.x) + Math.min(...mapJson.x)) / 2;
			const centerY = (Math.max(...mapJson.y) + Math.min(...mapJson.y)) / 2;

			const fixedRotation = mapJson.rotation ? mapJson.rotation + ROTATION_FIX : 0;

			const rawSectors = createSectors(mapJson);
			const sectors = rawSectors.map((s) => ({
				...s,
				start: rotate(s.start.x, s.start.y, fixedRotation, centerX, centerY),
				end: rotate(s.end.x, s.end.y, fixedRotation, centerX, centerY),
				labelPos: rotate(s.labelPos.x, s.labelPos.y, fixedRotation, centerX, centerY),
				points: s.points.map((p) => rotate(p.x, p.y, fixedRotation, centerX, centerY)),
			}));

			const cornerPositions: Corner[] = mapJson.corners.map((corner) => ({
				number: corner.number,
				pos: rotate(corner.trackPosition.x, corner.trackPosition.y, fixedRotation, centerX, centerY),
				labelPos: rotate(
					corner.trackPosition.x + 560 * Math.cos(rad(corner.angle)),
					corner.trackPosition.y + 560 * Math.sin(rad(corner.angle)),
					fixedRotation,
					centerX,
					centerY,
				),
			}));

			const rotatedPoints = mapJson.x.map((x, index) => rotate(x, mapJson.y[index], fixedRotation, centerX, centerY));
			const pointsX = rotatedPoints.map((p) => p.x);
			const pointsY = rotatedPoints.map((p) => p.y);

			const minPointX = Math.min(...pointsX);
			const maxPointX = Math.max(...pointsX);
			const minPointY = Math.min(...pointsY);
			const maxPointY = Math.max(...pointsY);

			// On mobile, keep original full layout (SPACE = 650); on PC, make it comfortably larger without touching borders (SPACE = 1500)
			const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
			const SPACE = isMobile ? 650 : 1500;

			const cMinX = minPointX - SPACE;
			const cMinY = minPointY - SPACE;
			const cWidthX = maxPointX - minPointX + SPACE * 2;
			const cWidthY = maxPointY - minPointY + SPACE * 2;

			const rotatedFinishLine = rotate(mapJson.x[0], mapJson.y[0], fixedRotation, centerX, centerY);

			const p3 = rotatedPoints[Math.min(3, rotatedPoints.length - 1)];
			const p0 = rotatedPoints[0];
			const dx = p3.x - p0.x;
			const dy = p3.y - p0.y;
			const startAngle = Math.atan2(dy, dx) * (180 / Math.PI);

			// Store original track points for position calculation
			const originalPoints = mapJson.x.map((x, index) => ({ x, y: mapJson.y[index] }));

			setCenter([centerX, centerY]);
			setBounds([cMinX, cMinY, cWidthX, cWidthY]);
			setSectors(sectors);
			setPoints(rotatedPoints);
			setRotation(fixedRotation);
			setCorners(cornerPositions);
			setFinishLine({ x: rotatedFinishLine.x, y: rotatedFinishLine.y, startAngle });
			setOriginalTrackPoints(originalPoints);
		};

		updateMap();

		const handleResize = () => {
			updateMap();
		};
		window.addEventListener("resize", handleResize);

		return () => {
			isMounted = false;
			window.removeEventListener("resize", handleResize);
		};
	}, [circuitKey, circuitShortName, meetingName, circuitOverride]);

	const yellowSectors = useMemo(() => findYellowSectors(raceControlMessages), [raceControlMessages]);

	const renderedSectors = useMemo(() => {
		const status = getTrackStatusMessage(trackStatus?.Status ? parseInt(trackStatus.Status) : undefined);

		return sectors
			.map((sector) => {
				const color = getSectorColor(sector, status?.bySector, status?.trackColor, yellowSectors);
				return {
					color,
					pulse: status?.pulse,
					number: sector.number,
					strokeWidth: 110,
					d: `M${sector.points[0].x},${sector.points[0].y} ${sector.points.map((point) => `L${point.x},${point.y}`).join(" ")}`,
				};
			})
			.sort(prioritizeColoredSectors);
	}, [trackStatus, sectors, yellowSectors]);

	// Minisector Dominance Comparison when 2 drivers are selected
	const comparisonData = useMemo(() => {
		if (favoriteDrivers.length < 2 || !drivers || !timingDrivers || !points || points.length === 0) {
			return null;
		}

		const id1 = favoriteDrivers[0];
		const id2 = favoriteDrivers[1];
		const d1 = drivers[id1];
		const d2 = drivers[id2];
		const t1 = timingDrivers.Lines[id1];
		const t2 = timingDrivers.Lines[id2];
		const stats1 = timingStats?.Lines[id1];
		const stats2 = timingStats?.Lines[id2];

		if (!d1 || !d2 || !t1 || !t2) return null;

		const { color1, color2, isSameTeam } = getComparisonColors(d1, d2);
		const mode = comparisonMode || "last";

		// Sector times by mode
		const s1SectorValues = mode === "last"
			? [
				t1.Sectors?.[0]?.Value || t1.Sectors?.[0]?.PreviousValue,
				t1.Sectors?.[1]?.Value || t1.Sectors?.[1]?.PreviousValue,
				t1.Sectors?.[2]?.Value || t1.Sectors?.[2]?.PreviousValue,
			]
			: [
				stats1?.BestSectors?.[0]?.Value || t1.Sectors?.[0]?.Value,
				stats1?.BestSectors?.[1]?.Value || t1.Sectors?.[1]?.Value,
				stats1?.BestSectors?.[2]?.Value || t1.Sectors?.[2]?.Value,
			];

		const s2SectorValues = mode === "last"
			? [
				t2.Sectors?.[0]?.Value || t2.Sectors?.[0]?.PreviousValue,
				t2.Sectors?.[1]?.Value || t2.Sectors?.[1]?.PreviousValue,
				t2.Sectors?.[2]?.Value || t2.Sectors?.[2]?.PreviousValue,
			]
			: [
				stats2?.BestSectors?.[0]?.Value || t2.Sectors?.[0]?.Value,
				stats2?.BestSectors?.[1]?.Value || t2.Sectors?.[1]?.Value,
				stats2?.BestSectors?.[2]?.Value || t2.Sectors?.[2]?.Value,
			];

		// Minisector segments by mode
		const seg1 = mode === "last"
			? (t1.Sectors?.flatMap((s) => s.Segments || []) || [])
			: (bestLapSegments?.[id1]?.flatMap((s) => s) || []);

		const seg2 = mode === "last"
			? (t2.Sectors?.flatMap((s) => s.Segments || []) || [])
			: (bestLapSegments?.[id2]?.flatMap((s) => s) || []);

		const baseCount = Math.max(
			t1.Sectors?.flatMap((s) => s.Segments || []).length || 0,
			t2.Sectors?.flatMap((s) => s.Segments || []).length || 0,
			seg1.length,
			seg2.length,
			11
		);
		const totalSegments = baseCount;

		let d1Wins = 0;
		let d2Wins = 0;

		const segmentSlices: { id: string; d: string; color: string; winner: 1 | 2 | "tie" }[] = [];
		const pointsPerSlice = points.length / totalSegments;

		for (let i = 0; i < totalSegments; i++) {
			const startIdx = Math.floor(i * pointsPerSlice);
			const endIdx = Math.min(Math.floor((i + 1) * pointsPerSlice) + 1, points.length);
			const slicePoints = points.slice(startIdx, endIdx);

			if (slicePoints.length < 2) continue;

			// Determine which sector (0, 1, or 2) this slice belongs to
			let sectorIdx = 0;
			const refSectors = (t1.Sectors && t1.Sectors.length === 3) ? t1.Sectors : t2.Sectors;
			if (refSectors && refSectors.length === 3) {
				let accumulated = 0;
				for (let s = 0; s < 3; s++) {
					accumulated += (refSectors[s]?.Segments?.length || 0);
					if (i < accumulated) {
						sectorIdx = s;
						break;
					}
					if (s === 2) sectorIdx = 2;
				}
			} else {
				sectorIdx = Math.min(Math.floor(i / (totalSegments / 3)), 2);
			}

			const s1Status = seg1[i]?.Status || 0;
			const s2Status = seg2[i]?.Status || 0;

			let winner: 1 | 2 | "tie" = "tie";

			if (s1Status === 2051 && s2Status !== 2051) {
				winner = 1;
			} else if (s2Status === 2051 && s1Status !== 2051) {
				winner = 2;
			} else if (s1Status === 2049 && (s2Status === 2048 || s2Status === 2052 || s2Status === 0 || !s2Status)) {
				winner = 1;
			} else if (s2Status === 2049 && (s1Status === 2048 || s1Status === 2052 || s1Status === 0 || !s1Status)) {
				winner = 2;
			} else {
				// Sector comparison fallback
				const v1 = parseTimeToSeconds(s1SectorValues[sectorIdx]);
				const v2 = parseTimeToSeconds(s2SectorValues[sectorIdx]);

				if (v1 !== null && v2 !== null) {
					if (Math.abs(v1 - v2) > 0.0005) {
						winner = v1 < v2 ? 1 : 2;
					} else {
						winner = "tie";
					}
				} else if (v1 !== null) {
					winner = 1;
				} else if (v2 !== null) {
					winner = 2;
				} else {
					// Fallback to lap time comparison
					const lap1Time = mode === "last"
						? (t1.LastLapTime?.Value || t1.BestLapTime?.Value)
						: (t1.BestLapTime?.Value || stats1?.PersonalBestLapTime?.Value || t1.LastLapTime?.Value);
					const lap2Time = mode === "last"
						? (t2.LastLapTime?.Value || t2.BestLapTime?.Value)
						: (t2.BestLapTime?.Value || stats2?.PersonalBestLapTime?.Value || t2.LastLapTime?.Value);
					const lap1Sec = parseTimeToSeconds(lap1Time);
					const lap2Sec = parseTimeToSeconds(lap2Time);
					if (lap1Sec !== null && lap2Sec !== null && Math.abs(lap1Sec - lap2Sec) > 0.0005) {
						winner = lap1Sec < lap2Sec ? 1 : 2;
					} else {
						winner = "tie";
					}
				}
			}

			if (winner === 1) d1Wins++;
			if (winner === 2) d2Wins++;

			const strokeColor = winner === 1 ? color1 : winner === 2 ? color2 : "#4B5563";
			const d = `M${slicePoints[0].x},${slicePoints[0].y} ${slicePoints.map((p) => `L${p.x},${p.y}`).join(" ")}`;

			segmentSlices.push({
				id: `seg.slice.${i}`,
				d,
				color: strokeColor,
				winner,
			});
		}

		return {
			mode,
			d1,
			d2,
			color1,
			color2,
			isSameTeam,
			d1Wins,
			d2Wins,
			totalSegments,
			segmentSlices,
		};
	}, [favoriteDrivers, drivers, timingDrivers, timingStats, bestLapSegments, comparisonMode, points]);

	if (!points || minX === null || minY === null || widthX === null || widthY === null) {
		return (
			<div className="h-full w-full p-2" style={{ minHeight: "35rem" }}>
				<div className="h-full w-full animate-pulse rounded-lg bg-zinc-800/40" />
			</div>
		);
	}

	const sectorSplitIndices = sectors[0]?.splitIndices || [190, 433];

	return (
		<div className="flex flex-col w-full h-full">
			{/* Minisector Dominance Legend directly on general background above the map */}
			{comparisonData && (
				<div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-1.5 pb-1 text-xs font-mono select-none">
					<div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
						<Zap className="w-3.5 h-3.5 text-cyan-400" />
						<span>
							{comparisonData.mode === "best" ? "Minisectores en pista (PB):" : "Minisectores en pista (Última):"}
						</span>
					</div>

					<div className="flex items-center gap-2.5 text-xs">
						<div className="flex items-center gap-1.5 font-bold">
							<span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comparisonData.color1 }} />
							<span className="text-white font-sans">{comparisonData.d1.FullName || comparisonData.d1.Tla}</span>
							<span className="text-gray-400 font-mono text-[11px]">({comparisonData.d1Wins})</span>
						</div>

						<span className="text-gray-500 font-sans text-xs">vs</span>

						<div className="flex items-center gap-1.5 font-bold">
							<span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comparisonData.color2 }} />
							<span className="text-white font-sans">{comparisonData.d2.FullName || comparisonData.d2.Tla}</span>
							<span className="text-gray-400 font-mono text-[11px]">({comparisonData.d2Wins})</span>
						</div>

						{comparisonData.isSameTeam && (
							<span className="text-[11px] text-gray-400 font-sans">
								({comparisonData.d1.TeamName})
							</span>
						)}
					</div>
				</div>
			)}

			<div className="relative flex-1 w-full h-full flex items-center justify-center p-0 md:p-3 lg:p-4">
				<svg
					viewBox={`${minX} ${minY} ${widthX} ${widthY}`}
					className="w-full h-full md:max-h-[82vh] lg:max-h-[88vh] object-contain"
					xmlns="http://www.w3.org/2000/svg"
				>
					{/* If 2 drivers selected, render the Minisector Comparison Slices */}
					{comparisonData && comparisonData.segmentSlices.length > 0 ? (
						comparisonData.segmentSlices.map((slice) => (
							<path
								key={slice.id}
								stroke={slice.color}
								strokeWidth={120}
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="transparent"
								d={slice.d}
							/>
						))
					) : (
						/* Default Race / Yellow / Track status sectors */
						renderedSectors.map((sector) => {
							const style = sector.pulse
								? {
										animation: `${sector.pulse * 100}ms linear infinite pulse`,
									}
								: {};
							return (
								<path
									key={`map.sector.${sector.number}`}
									className={sector.color}
									strokeWidth={sector.strokeWidth}
									strokeLinecap="round"
									strokeLinejoin="round"
									fill="transparent"
									d={sector.d}
									style={style}
								/>
							);
						})
					)}

					{/* Start / Finish line */}
					{finishLine && (
						<line
							x1={finishLine.x}
							y1={finishLine.y - 180}
							x2={finishLine.x}
							y2={finishLine.y + 180}
							stroke="#FFFFFF"
							strokeWidth={80}
							strokeLinecap="round"
							transform={`rotate(${finishLine.startAngle + 90}, ${finishLine.x}, ${finishLine.y})`}
						/>
					)}

					{/* Corner Numbers */}
					{showCornerNumbers &&
						corners.map((corner) => (
							<CornerNumber
								key={`corner.${corner.number}`}
								number={corner.number}
								x={corner.labelPos.x}
								y={corner.labelPos.y}
							/>
						))}

					{/* Driver Car Dots */}
					{centerX !== null && centerY !== null && drivers && timingDrivers && (
						<>
							{Object.values(drivers)
								.reverse()
								.filter((driver) => (filter ? filter.includes(driver.RacingNumber) : true))
								.map((driver) => {
									const timingDriver = timingDrivers?.Lines[driver.RacingNumber];
									const hidden = timingDriver
										? timingDriver.KnockedOut || timingDriver.Stopped || timingDriver.Retired
										: false;
									const pit = timingDriver ? timingDriver.InPit : false;

									const driverPosition = getDriverPosition(timingDriver, originalTrackPoints, sectorSplitIndices);

									// Skip rendering if we can't determine position
									if (!driverPosition) return null;

									const isCar1 = comparisonData && comparisonData.d1.RacingNumber === driver.RacingNumber;
									const isCar2 = comparisonData && comparisonData.d2.RacingNumber === driver.RacingNumber;
									const dotColor = isCar1 ? comparisonData.color1 : isCar2 ? comparisonData.color2 : driver.TeamColour;

									return (
										<CarDot
											key={`map.driver.${driver.RacingNumber}`}
											favoriteDriver={favoriteDrivers.length > 0 ? favoriteDrivers.includes(driver.RacingNumber) : false}
											name={driver.Tla}
											color={dotColor}
											pit={pit}
											hidden={hidden}
											pos={driverPosition}
											rotation={rotation}
											centerX={centerX}
											centerY={centerY}
										/>
									);
								})}
						</>
					)}
				</svg>
			</div>
		</div>
	);
}

type CornerNumberProps = {
	number: number;
	x: number;
	y: number;
};

const CornerNumber: React.FC<CornerNumberProps> = ({ number, x, y }) => {
	return (
		<text
			x={x}
			y={y}
			className="fill-zinc-400 font-mono select-none"
			fontSize={230}
			fontWeight="bold"
			textAnchor="middle"
			dominantBaseline="middle"
		>
			{number}
		</text>
	);
};

type CarDotProps = {
	name: string;
	color: string | undefined;
	favoriteDriver: boolean;

	pit: boolean;
	hidden: boolean;

	pos: PositionCar;
	rotation: number;

	centerX: number;
	centerY: number;
};

const CarDot = ({ pos, name, color, favoriteDriver, pit, hidden, rotation, centerX, centerY }: CarDotProps) => {
	const rotatedPos = rotate(pos.X, pos.Y, rotation, centerX, centerY);
	const transform = [`translateX(${rotatedPos.x}px)`, `translateY(${rotatedPos.y}px)`].join(" ");
	const fillColor = color ? (color.startsWith("#") ? color : `#${color}`) : "#CBD5E1";

	const radius = favoriteDriver ? 130 : 90;
	const fontSize = favoriteDriver ? 440 : 330;

	return (
		<g
			className={clsx("notranslate", { "opacity-30": pit }, { "opacity-0!": hidden })}
			style={{
				transition: "all 1s linear",
				transform,
				fill: fillColor,
			}}
		>
			{/* Pulse effect for favorite driver */}
			{favoriteDriver && (
				<circle
					r={radius + 40}
					fill="none"
					stroke={fillColor}
					strokeWidth={20}
					className="animate-ping opacity-60"
				/>
			)}

			<circle id="map.driver.circle" r={radius} />
			<text
				id="map.driver.text"
				className="notranslate"
				fontWeight="bold"
				fontSize={fontSize}
				style={{
					transform: `translateX(${radius + 35}px) translateY(-${radius * 0.3}px)`,
					userSelect: "none",
				}}
			>
				{name}
			</text>
		</g>
	);
};
