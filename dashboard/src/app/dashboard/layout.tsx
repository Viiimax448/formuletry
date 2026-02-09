'use client';

import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { useDataEngine } from '@/hooks/useDataEngine';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useStores } from '@/hooks/useStores';
import { useSocket } from '@/hooks/useSocket';

import { useSettingsStore } from '@/stores/useSettingsStore';
import { useDataStore } from '@/stores/useDataStore';

import SessionInfo from '@/components/SessionInfo';
import WeatherInfo from '@/components/WeatherInfo';
import TrackInfo from '@/components/TrackInfo';

type Props = {
	children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
	const stores = useStores();
	const { handleInitial, handleUpdate, maxDelay } = useDataEngine(stores);
	useSocket({ handleInitial, handleUpdate });

	const delay = useSettingsStore((state) => state.delay);
	const syncing = delay > maxDelay;

	useWakeLock();

	const ended = useDataStore(({ state }) => state?.SessionStatus?.Status === 'Ends');

	return (
		<div className="flex h-screen w-full bg-[#111827] p-2">
			<motion.div layout="size" className="flex h-full w-full flex-1 flex-col gap-2">
				<DesktopStaticBar show={!syncing || ended} />
				<MobileStaticBar show={!syncing || ended} />

				<div
					className={
						!syncing || ended ? 'no-scrollbar w-full flex-1 overflow-auto rounded-lg' : 'hidden'
					}
				>
					<MobileDynamicBar />
					{children}
				</div>

				<div
					className={
						syncing && !ended
							? 'flex h-full flex-1 flex-col items-center justify-center gap-2 border-zinc-800 rounded-lg border'
							: 'hidden'
					}
				>
					<h1 className="my-20 text-center text-5xl font-bold">Syncing...</h1>
					<p>Please wait for {delay - maxDelay} seconds.</p>
					<p>Or make your delay smaller.</p>
				</div>
			</motion.div>
		</div>
	);
}

function MobileDynamicBar() {
	return (
		<div className="flex flex-col divide-y divide-zinc-800 border-b border-zinc-800 md:hidden">
			<div className="p-2">
				<SessionInfo />
			</div>
			<div className="p-2">
				<WeatherInfo />
			</div>
		</div>
	);
}

function MobileStaticBar({ show }: { show: boolean }) {
	return (
		<div className="flex w-full items-center justify-end overflow-hidden border-b border-zinc-800 p-2 md:hidden">
			{show && <TrackInfo />}
		</div>
	);
}

function DesktopStaticBar({ show }: { show: boolean }) {
	return (
		<div className="hidden w-full flex-row justify-between overflow-hidden rounded-lg bg-[#111827] border border-gray-600/30 p-4 shadow-lg md:flex">
			<div className="flex items-center gap-2">
				<SessionInfo />
			</div>

			<div className="hidden md:items-center lg:flex">{show && <WeatherInfo />}</div>

			<div className="flex justify-end">{show && <TrackInfo />}</div>
		</div>
	);
}
