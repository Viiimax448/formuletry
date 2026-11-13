import clsx from "clsx";
import TireIcon from "../TireIcon";
import type { Stint } from "@/types/state.type";

type Props = {
    stints: Stint[] | undefined;
};

// Estimación realista de vida útil por compuesto en vueltas
const getCompoundExpectedLaps = (compound: string) => {
    const c = compound.toLowerCase();
    if (c.includes("soft")) return 20;
    if (c.includes("medium")) return 30;
    if (c.includes("hard")) return 42;
    if (c.includes("inter")) return 28;
    if (c.includes("wet")) return 32;
    return 30;
};

// Color sutil según porcentaje de vida restante
const getLifeColor = (remainingRatio: number) => {
    if (remainingRatio > 0.5) return "bg-emerald-400"; // > 50%: Verde
    if (remainingRatio > 0.22) return "bg-amber-400";   // 22% - 50%: Amarillo
    return "bg-rose-500";                             // < 22%: Rojo (desgaste crítico)
};

export default function DriverTire({ stints }: Props) {
    const stops = stints ? stints.length - 1 : 0;
    const currentStint = stints ? stints[stints.length - 1] : null;

    const laps = currentStint?.TotalLaps ?? 0;
    const compound = currentStint?.Compound || "";
    const expectedLaps = getCompoundExpectedLaps(compound);
    const remainingRatio = Math.max(0, 1 - laps / expectedLaps);
    const lifeColor = getLifeColor(remainingRatio);

    return (
        <div className="flex flex-row items-center gap-1.5 place-self-start whitespace-nowrap">
            {currentStint ? (
                <div 
                    className="flex flex-col items-center gap-0.5 shrink-0" 
                    title={`Vida estimada: ${Math.round(remainingRatio * 100)}% (${laps}/${expectedLaps} vueltas)`}
                >
                    <TireIcon compound={compound} size={22} />
                    {/* Sutil línea de vida útil */}
                    <div className="w-5 h-[2px] rounded-full bg-white/[0.08] overflow-hidden">
                        <div 
                            className={clsx("h-full rounded-full transition-all duration-300 opacity-80", lifeColor)}
                            style={{ width: `${Math.max(10, Math.min(100, Math.round(remainingRatio * 100)))}%` }}
                        />
                    </div>
                </div>
            ) : (
                <div className="h-6 w-6 animate-pulse rounded-full bg-slate-800" />
            )}

            <div className="flex flex-col justify-center whitespace-nowrap">
                <p className="text-[13px] leading-none font-semibold text-white whitespace-nowrap">
                    L {laps}
                    {currentStint?.New ? "" : "*"}
                </p>

                <p className="text-[10px] leading-none text-slate-400 mt-0.5">
                    PIT {stops}
                </p>
            </div>
        </div>
    );
}
