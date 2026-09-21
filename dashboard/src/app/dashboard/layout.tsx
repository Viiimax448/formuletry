'use client';

import { type ReactNode } from 'react';
import { motion } from 'motion/react';

import { useDataEngine } from '@/hooks/useDataEngine';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useStores } from '@/hooks/useStores';
import { useSocket } from '@/hooks/useSocket';

import { useSettingsStore } from '@/stores/useSettingsStore';
import { useDataStore } from '@/stores/useDataStore';

import DesktopHeader from '@/components/dashboard/DesktopHeader';
import MobileHeader from '@/components/dashboard/MobileHeader';

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
		<div className="flex w-full bg-[#111827] p-2 md:min-h-screen">
			<motion.div layout="size" className="flex w-full flex-1 flex-col gap-2">
				{(!syncing || ended) && <DesktopHeader />}
				{(!syncing || ended) && <MobileHeader />}

				<div
					className={
						!syncing || ended ? 'w-full rounded-lg' : 'hidden'
					}
				>
					{children}
				</div>

				<div
					className={
						syncing && !ended
							? 'flex min-h-screen flex-1 flex-col items-center justify-center gap-2 border-zinc-800 rounded-lg border'
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
