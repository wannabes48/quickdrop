import { useState, useEffect, useCallback, useRef } from 'react';

export function useWebSocket(url) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('disconnected');
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 7;

  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(url);
      setStatus('connecting');

      wsRef.current.onopen = () => {
        setStatus('connected');
        reconnectAttempts.current = 0; // Reset attempts on successful connection
      };

      wsRef.current.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
        } catch (e) {
          console.error("Error parsing WebSocket data:", e);
        }
      };

      wsRef.current.onclose = () => {
        setStatus('disconnected');
        // Reconnect logic with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`WebSocket reconnecting in ${timeout}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connect();
          }, timeout);
        } else {
          setStatus('failed');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        wsRef.current.close();
      };
    } catch (e) {
      console.error("WebSocket connect error: ", e);
    }
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on unmount
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { data, status };
}
