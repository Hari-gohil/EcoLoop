import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket, connected, emitEvent } = useSocket(user?.id);
  
  // Global state for chat
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming private messages
    const handleReceiveMessage = (message) => {
      setIncomingMessages(prev => [...prev, message]);
      
      // If the message is NOT from the current user, increment unread count
      if (message.sender_id !== user?.id) {
        setUnreadCount(prev => prev + 1);
      }
    };

    socket.on('receive_private_message', handleReceiveMessage);

    return () => {
      socket.off('receive_private_message', handleReceiveMessage);
    };
  }, [socket, user]);

  // Method to send a message
  const sendMessage = useCallback((receiverId, messageText) => {
    if (!user?.id) return;
    
    emitEvent('send_private_message', {
      sender_id: user.id,
      receiver_id: receiverId,
      message: messageText
    });
  }, [user, emitEvent]);

  // Clear incoming messages (usually called by ChatBox when it consumes them)
  const clearIncomingMessages = useCallback((otherUserId) => {
    setIncomingMessages(prev => prev.filter(msg => 
      !(msg.sender_id === otherUserId || msg.receiver_id === otherUserId)
    ));
    // Reset unread count for simplicity, in a real app you'd calculate this properly
    setUnreadCount(0); 
  }, []);

  return (
    <ChatContext.Provider value={{ 
      connected, 
      sendMessage, 
      incomingMessages, 
      clearIncomingMessages,
      unreadCount 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
