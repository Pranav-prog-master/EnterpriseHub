"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { addNotification } from "@/features/notifications/notificationsSlice";

export function useWebSocket(path: string, onMessage?: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const dispatch = useAppDispatch();

  const connect = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
    const token = localStorage.getItem("access_token");
    wsRef.current = new WebSocket(`${wsUrl}${path}?token=${token}`);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        dispatch(addNotification(data));
      }
      onMessage?.(data);
    };

    wsRef.current.onclose = () => {
      setTimeout(connect, 3000);
    };
  }, [path, onMessage, dispatch]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { send };
}
