import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL.replace('/api', '');

const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      autoConnect: true,
    });

    // Handle connection
    newSocket.on('connect', () => {
      setConnected(true);
      // Join user's personal room for receiving private messages
      newSocket.emit('join_user_room', userId);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount or when userId changes
    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // Expose a helper to emit messages safely
  const emitEvent = useCallback((eventName, data) => {
    if (socket && connected) {
      socket.emit(eventName, data);
    } else {
      console.warn('Socket not connected. Cannot emit:', eventName);
    }
  }, [socket, connected]);

  return { socket, connected, emitEvent };
};

export default useSocket;
