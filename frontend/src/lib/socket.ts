let socket: WebSocket | null = null;

export function getSocket(path: string): WebSocket {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(`${wsUrl}${path}`);
  }
  return socket;
}

export function closeSocket() {
  socket?.close();
  socket = null;
}
