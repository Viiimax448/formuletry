import { AnimatePresence, LayoutGroup } from "motion/react";
import clsx from "clsx";
import { useState } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDataStore } from "@/stores/useDataStore";

import { sortPos } from "@/lib/sorting";

import Driver from "@/components/driver/Driver";
import DriverCardModal from "./DriverCardModal";

export default function LeaderBoard() {
    const [driverCardOpen, setDriverCardModalOpen] = useState<string | null>(null);

    const compactMode = useSettingsStore((state) => state.compactMode);
    const showTableHeader = useSettingsStore((state) => state.tableHeaders);
    const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);
    const setFavoriteDrivers = useSettingsStore((state) => state.setFavoriteDrivers);
    const removeFavoriteDriver = useSettingsStore((state) => state.removeFavoriteDriver);

    const drivers = useDataStore(({ state }) => state?.DriverList);
    const driversTiming = useDataStore(({ state }) => state?.TimingData);

    return (
        <div className="flex w-full flex-col gap-0 overflow-x-auto overflow-y-hidden pb-2 mb-2">
            {showTableHeader && <TableHeaders compactMode={compactMode} />}

            {(!drivers || !driversTiming) &&
                new Array(22).fill("").map((_, index) => <SkeletonDriver key={`driver.loading.${index}`} compactMode={compactMode} />)}

            <LayoutGroup key="drivers">
                {drivers && driversTiming && (
                    <AnimatePresence>
                        {Object.values(driversTiming.Lines)
                            .sort(sortPos)
                            .map((timingDriver, index) => {
                                const isSelected = favoriteDrivers.includes(timingDriver.RacingNumber);
                                
                                const toggleFavorite = () => {
                                    if (isSelected) {
                                        removeFavoriteDriver(timingDriver.RacingNumber);
                                    } else {
                                        setFavoriteDrivers([...favoriteDrivers, timingDriver.RacingNumber]);
                                    }
                                };
                                
                                return (
                                    <Driver
                                        key={`leaderBoard.driver.${timingDriver.RacingNumber}`}
                                        position={index + 1}
                                        driver={drivers[timingDriver.RacingNumber]}
                                        timingDriver={timingDriver}
                                        isSelected={isSelected}
                                        handleSelectDriver={toggleFavorite}
                                        onOpenDriverCard={() => setDriverCardModalOpen(timingDriver.RacingNumber)}
                                    />
                                );
                            })}
                    </AnimatePresence>
                )}
            </LayoutGroup>

            {driverCardOpen && drivers && driversTiming && drivers[driverCardOpen] && driversTiming.Lines[driverCardOpen] && (
                <DriverCardModal
                    driver={drivers[driverCardOpen]}
                    timingDriver={driversTiming.Lines[driverCardOpen]}
                    onClose={() => setDriverCardModalOpen(null)}
                />
            )}
        </div>
    );
}

const TableHeaders = ({ compactMode }: { compactMode: boolean }) => {
    const carMetrics = useSettingsStore((state) => state.carMetrics);

    return (
        <div
            className="grid items-center gap-1.5 p-1.5 px-1.5 text-xs font-semibold text-gray-400 bg-[#1F2937]/80 rounded-lg mb-1.5 border border-gray-700/40"
            style={{
                gridTemplateColumns: compactMode
                    ? "7.4rem 2.5rem 4.2rem 4.6rem 4.6rem 2.2rem"
                    : carMetrics
                    ? "7.4rem 2.5rem 4.2rem 4.6rem 4.6rem 2.2rem auto 10.5rem"
                    : "7.4rem 2.5rem 4.2rem 4.6rem 4.6rem 2.2rem auto",
            }}
        >
            <p>Pos</p>
            <p className="text-center">PIT</p>
            <p>Gap</p>
            <p>Tire</p>
            <p>LapTime</p>
            <p className="text-center">Laps</p>
            {!compactMode && <p>Sectors</p>}
            {carMetrics && !compactMode && <p>Car Metrics</p>}
        </div>
    );
};

const SkeletonDriver = ({ compactMode }: { compactMode: boolean }) => {
    const carMetrics = useSettingsStore((state) => state.carMetrics);

    const animateClass = "h-7 animate-pulse rounded bg-zinc-800";

    return (
        <div className="flex flex-col gap-1 p-1 border-b border-gray-800/60">
            <div
                className="grid items-center gap-1.5"
                style={{
                    gridTemplateColumns: compactMode
                        ? "7.4rem 2.5rem 4.2rem 4.6rem 4.6rem 2.2rem"
                        : carMetrics
                        ? "7.4rem 2.5rem 4.2rem 4.6rem 4.6rem 2.2rem auto 10.5rem"
                        : "7.4rem 2.5rem 4.2rem 4.6rem 4.6rem 2.2rem auto",
                }}
            >
                <div className={animateClass} style={{ width: "100%" }} />
                <div className={animateClass} style={{ width: "100%" }} />
                <div className="flex w-full flex-col gap-1">
                    <div className={clsx(animateClass, "h-3.5 w-full")} />
                </div>
                <div className="flex w-full flex-col gap-1">
                    <div className={clsx(animateClass, "h-3.5 w-full")} />
                </div>
                <div className="flex w-full flex-col gap-1">
                    <div className={clsx(animateClass, "h-3.5 w-full")} />
                    <div className={clsx(animateClass, "h-2 w-2/3")} />
                </div>
                <div className={clsx(animateClass, "h-3.5 w-6 mx-auto")} />

                {!compactMode && (
                    <div className="flex w-full gap-1">
                        {new Array(3).fill(null).map((_, index) => (
                            <div className="flex w-full flex-col gap-1" key={`skeleton.sector.${index}`}>
                                <div className={clsx(animateClass, "h-3.5 w-full")} />
                                <div className={clsx(animateClass, "h-2 w-2/3")} />
                            </div>
                        ))}
                    </div>
                )}

                {carMetrics && !compactMode && (
                    <div className="flex w-full gap-2">
                        <div className={clsx(animateClass, "w-8")} />
                        <div className="flex flex-1 flex-col gap-1">
                            <div className={clsx(animateClass, "h-3 w-full")} />
                        </div>
                    </div>
                )}
            </div>

            {compactMode && (
                <div className="flex items-center gap-2 pl-1 py-0.5">
                    <div className="flex gap-2">
                        {new Array(3).fill(null).map((_, index) => (
                            <div className="h-3 w-12 animate-pulse rounded bg-zinc-800" key={`skeleton.compact.sector.${index}`} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};