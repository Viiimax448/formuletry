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
		if (!env.NEXT_PUBLIC_LIVE_URL) {
			console.log("No NEXT_PUBLIC_LIVE_URL configured, skipping live connection");
			setConnected(false);
			return () => {};
		}
		
		console.log("Connecting to live URL:", env.NEXT_PUBLIC_LIVE_URL);
		const sse = new EventSource(`${env.NEXT_PUBLIC_LIVE_URL}/api/realtime`);
		
		sse.onopen = () => {
			console.log("✅ SSE connection successfully opened!");
			setConnected(true);
		};

		sse.onerror = (e) => {
			console.error("❌ SSE connection error or closed:", e);
			setConnected(false);
		};
		
		sse.addEventListener("initial", (message) => {
			console.log("📦 Received 'initial' event data:", message.data);
			handleInitial(JSON.parse(message.data));
		});
		
		sse.addEventListener("update", (message) => {
			console.log("🔄 Received 'update' event data:", message.data);
			handleUpdate(JSON.parse(message.data));
		});
		
		return () => sse.close();
	}, []);

	return { connected };
};
