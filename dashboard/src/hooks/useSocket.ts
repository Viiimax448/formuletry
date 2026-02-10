import { useEffect, useState } from "react";

import type { MessageInitial, MessageUpdate } from "@/types/message.type";

import { env } from "@/env";

type Props = {
	handleInitial: (data: MessageInitial) => void;
	handleUpdate: (data: MessageUpdate) => void;
};

export const useSocket = ({ handleInitial, handleUpdate }: Props) => {
	const [connected, setConnected] = useState<boolean>(false);

	useEffect(() => {
		// DISABLED: Skip WebSocket connection entirely until realtime backend is configured
		console.log("WebSocket disabled - no realtime backend available");
		setConnected(false);
		return () => {}; // No cleanup needed
		
		// Original WebSocket code commented out:
		// if (!env.NEXT_PUBLIC_LIVE_URL) {
		// 	console.log("No NEXT_PUBLIC_LIVE_URL configured, skipping live connection");
		// 	setConnected(false);
		// 	return () => {};
		// }
		// console.log("Connecting to live URL:", env.NEXT_PUBLIC_LIVE_URL);
		// const sse = new EventSource(`${env.NEXT_PUBLIC_LIVE_URL}/api/realtime`);
		// sse.onerror = () => setConnected(false);
		// sse.onopen = () => setConnected(true);
		// sse.addEventListener("initial", (message) => {
		// 	handleInitial(JSON.parse(message.data));
		// });
		// sse.addEventListener("update", (message) => {
		// 	handleUpdate(JSON.parse(message.data));
		// });
		// return () => sse.close();
	}, []);

	return { connected };
};
