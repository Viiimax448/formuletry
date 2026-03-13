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
        <div className="flex w-full flex-col gap-0 overflow-x-auto overflow-y-hidden pb-4 mb-4">
            {showTableHeader && <TableHeaders compactMode={compactMode} />}

            {(!drivers || !driversTiming) &&
                new Array(20).fill("").map((_, index) => <SkeletonDriver key={`driver.loading.${index}`} compactMode={compactMode} />)}

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
            className="grid items-center gap-2 p-4 px-6 text-sm font-medium text-gray-300 bg-slate-header rounded-xl mb-3 shadow-md border border-gray-600/30"
            style={{
                gridTemplateColumns: compactMode
                    ? "4rem 2.5rem 3.5rem 3rem 3.5rem auto"
                    : carMetrics
                    ? "4rem 2.5rem 4rem 3.5rem 4rem 3rem auto 8rem"
                    : "4rem 2.5rem 4rem 3.5rem 4rem 3rem auto",
            }}
        >
            <p>Position</p>
            <p>DRS</p>
            <p>Tire</p>
            <p>Gap</p>
            <p>LapTime</p>
            <p>Laps</p>
            {!compactMode && <p>Sectors</p>}
            {carMetrics && !compactMode && <p>Car Metrics</p>}
        </div>
    );
};

const SkeletonDriver = ({ compactMode }: { compactMode: boolean }) => {
    const carMetrics = useSettingsStore((state) => state.carMetrics);

    const animateClass = "h-8 animate-pulse rounded-md bg-zinc-800";

    return (
        <div
            className="grid items-center gap-2 p-1.5"
            style={{
                gridTemplateColumns: compactMode
                    ? "4rem 2.5rem 3.5rem 3rem 3.5rem auto"
                    : carMetrics
                    ? "4rem 2.5rem 4rem 3.5rem 4rem 3rem auto 8rem"
                    : "4rem 2.5rem 4rem 3.5rem 4rem 3rem auto",
            }}
        >
            <div className={animateClass} style={{ width: "100%" }} />

            <div className={animateClass} style={{ width: "100%" }} />

            <div className="flex w-full gap-2">
                <div className={clsx(animateClass, "w-8")} />

                <div className="flex flex-1 flex-col gap-1">
                    <div className={clsx(animateClass, "h-4!")} />
                    <div className={clsx(animateClass, "h-3! w-2/3")} />
                </div>
            </div>

            {new Array(2).fill(null).map((_, index) => (
                <div className="flex w-full flex-col gap-1" key={`skeleton.${index}`}>
                    <div className={clsx(animateClass, "h-4!")} />
                    <div className={clsx(animateClass, "h-3! w-2/3")} />
                </div>
            ))}

            <div className={animateClass} style={{ width: "100%" }} />

            <div className="flex w-full flex-col gap-1">
                <div className={clsx(animateClass, "h-3! w-4/5")} />
                <div className={clsx(animateClass, "h-4!")} />
            </div>

            {!compactMode && (
                <div className="flex w-full gap-1">
                    {new Array(3).fill(null).map((_, index) => (
                        <div className="flex w-full flex-col gap-1" key={`skeleton.sector.${index}`}>
                            <div className={clsx(animateClass, "h-4!")} />
                            <div className={clsx(animateClass, "h-3! w-2/3")} />
                        </div>
                    ))}
                </div>
            )}

            {carMetrics && !compactMode && (
                <div className="flex w-full gap-2">
                    <div className={clsx(animateClass, "w-8")} />

                    <div className="flex flex-1 flex-col gap-1">
                        <div className={clsx(animateClass, "h-1/2!")} />
                        <div className={clsx(animateClass, "h-1/2!")} />
                    </div>
                </div>
            )}
        </div>
    );
};