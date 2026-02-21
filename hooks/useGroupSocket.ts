import { useEffect, useRef, useCallback } from "react";

const WS_URL =
  (process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001")
    .replace(/^http/, "ws") + "/ws";

type DeuceLoggedEvent = {
  type: "deuce_logged";
  message: string;
  entry: any;
  userId: string;
};

/**
 * WebSocket hook — connects to ws://localhost:5001/ws,
 * joins a group channel, and calls onMessage for incoming events.
 */
export function useGroupSocket(
  groupId: string | null,
  onMessage?: (event: DeuceLoggedEvent) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!groupId) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_group", groupId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "deuce_logged" && onMessage) {
          onMessage(data);
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      // silent — reconnect on close
    };

    ws.onclose = () => {
      // auto-reconnect after 3s
      setTimeout(() => {
        if (wsRef.current === ws) {
          connect();
        }
      }, 3000);
    };
  }, [groupId, onMessage]);

  useEffect(() => {
    connect();
    return () => {
      const ws = wsRef.current;
      wsRef.current = null;
      ws?.close();
    };
  }, [connect]);
}
