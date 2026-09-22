import { create } from "zustand";
import type { Driver } from "@/types/state.type";

export type NotificationItem = {
	id: string;
	message: string;
	flag?: string;
	category?: string;
	lap?: number;
	utc: string;
	driver?: Driver;
	severity: "safety_car" | "red_flag" | "yellow_flag" | "vsc" | "warning" | "clear" | "default";
};

type NotificationStore = {
	activeNotification: NotificationItem | null;
	showNotification: (item: NotificationItem) => void;
	dismissNotification: () => void;
};

let autoDismissTimeout: NodeJS.Timeout | null = null;

export const useNotificationStore = create<NotificationStore>((set) => ({
	activeNotification: null,

	showNotification: (item: NotificationItem) => {
		if (autoDismissTimeout) {
			clearTimeout(autoDismissTimeout);
		}

		set({ activeNotification: item });

		// Auto dismiss tras 5.5 segundos
		autoDismissTimeout = setTimeout(() => {
			set({ activeNotification: null });
		}, 5500);
	},

	dismissNotification: () => {
		if (autoDismissTimeout) {
			clearTimeout(autoDismissTimeout);
		}
		set({ activeNotification: null });
	},
}));
