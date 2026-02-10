"use client";

import { create } from "zustand";

interface DonationModalStore {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

export const useDonationModal = create<DonationModalStore>()((set) => ({
	isOpen: false,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
}));