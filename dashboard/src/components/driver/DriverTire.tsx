import clsx from "clsx";
import TireIcon from "../TireIcon"; // Ajusta la ruta relativa si es necesario
import type { Stint } from "@/types/state.type";

type Props = {
    stints: Stint[] | undefined;
};

export default function DriverTire({ stints }: Props) {
    const stops = stints ? stints.length - 1 : 0;
    const currentStint = stints ? stints[stints.length - 1] : null;

    return (
        <div className="flex flex-row items-center gap-1.5 place-self-start whitespace-nowrap">
            {currentStint ? (
                <TireIcon compound={currentStint.Compound || ""} size={20} />
            ) : (
                <div className="h-5 w-5 animate-pulse rounded-full bg-slate-800" />
            )}

            <div className="flex flex-col justify-center whitespace-nowrap">
                <p className="text-xs leading-none font-semibold text-white whitespace-nowrap">
                    L {currentStint?.TotalLaps ?? 0}
                    {currentStint?.New ? "" : "*"}
                </p>

                <p className="text-[9.5px] leading-none text-slate-400 mt-0.5">
                    PIT {stops}
                </p>
            </div>
        </div>
    );
}
