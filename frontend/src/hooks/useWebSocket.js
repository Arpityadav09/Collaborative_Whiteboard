import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws';

export function useWebSocket({ sessionId, onBoardEvent, onChatEvent }) {
  const clientRef = useRef(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    const client = new Client({
      webSocketFactory: () => new window.SockJS(WS_URL),
      reconnectDelay: 3000,
      onConnect: () => {
        connectedRef.current = true;
        client.subscribe(`/topic/board/${sessionId}`, (msg) => {
          try { onBoardEvent && onBoardEvent(JSON.parse(msg.body)); } catch {}
        });
        client.subscribe(`/topic/chat/${sessionId}`, (msg) => {
          try { onChatEvent && onChatEvent(JSON.parse(msg.body)); } catch {}
        });
      },
      onDisconnect: () => { connectedRef.current = false; },
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); connectedRef.current = false; };
  }, [sessionId]);

  const send = useCallback((destination, payload) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(payload),
      });
    }
  }, []);

  const sendDraw = useCallback((event) => send('/app/draw', event), [send]);
  const sendCursor = useCallback((event) => send('/app/cursor', event), [send]);
  const sendChat = useCallback((msg) => send('/app/chat', msg), [send]);
  const sendJoin = useCallback((event) => send('/app/join', event), [send]);
  const sendLeave = useCallback((event) => send('/app/leave', event), [send]);

  return { sendDraw, sendCursor, sendChat, sendJoin, sendLeave, isConnected: () => connectedRef.current };
}
