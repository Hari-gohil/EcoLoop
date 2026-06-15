import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { useChat } from '../context/ChatContext';
import ChatService from '../services/chatService';
import { toast } from 'react-hot-toast';

const ChatBox = ({ activeConversation, onBack }) => {
  const { user } = useAuth();
  const { sendMessage, incomingMessages, clearIncomingMessages, connected } = useChat();
  
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch history when conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const history = await ChatService.getChatHistory(activeConversation.user_id);
        setMessages(history);
      } catch (error) {
        toast.error('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    // Clear any unread global messages for this user since we are now focused on them
    clearIncomingMessages(activeConversation.user_id);
  }, [activeConversation, clearIncomingMessages]);

  // Handle incoming live messages
  useEffect(() => {
    if (!activeConversation) return;

    // Filter incoming messages that belong to the active conversation
    const newMsgs = incomingMessages.filter(
      msg => msg.sender_id === activeConversation.user_id || msg.receiver_id === activeConversation.user_id
    );

    if (newMsgs.length > 0) {
      setMessages(prev => {
        // Prevent duplicate messages by checking IDs
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNewMsgs = newMsgs.filter(m => !existingIds.has(m.id));
        return [...prev, ...uniqueNewMsgs];
      });
      // Clear them from global context so they don't pile up
      clearIncomingMessages(activeConversation.user_id);
    }
  }, [incomingMessages, activeConversation, clearIncomingMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConversation) return;

    // The context will emit it and we will receive it via the socket (since it emits back to sender)
    // or we can optimistically append it here. Let's rely on the socket emitting back to sender for consistency.
    sendMessage(activeConversation.user_id, inputMsg);
    setInputMsg('');
  };

  if (!activeConversation) {
    return (
      <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
        {/* Mobile Back Button */}
        <button 
          className="btn" 
          onClick={onBack}
          style={{ background: 'transparent', padding: '0.5rem', width: 'auto', display: 'none' }}
          id="chat-back-btn"
        >
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg>
        </button>
        <style>{`
          @media (max-width: 768px) {
            #chat-back-btn { display: block !important; }
          }
        `}</style>
        
        <div style={{ 
          width: '45px', height: '45px', borderRadius: '50%', 
          background: 'var(--color-primary)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', 
          fontWeight: 'bold', fontSize: '1.2rem' 
        }}>
          {activeConversation.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{activeConversation.name}</h3>
          <span style={{ fontSize: '0.8rem', color: connected ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {connected ? '● Connected' : '○ Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 'auto', marginBottom: 'auto' }}>
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === user.id;
            return (
              <div key={msg.id || index} style={{ 
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  padding: '0.8rem 1.2rem',
                  borderRadius: isMe ? '15px 15px 0 15px' : '15px 15px 15px 0',
                  background: isMe ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                  color: isMe ? '#fff' : 'var(--color-text-main)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  {msg.message}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.3rem', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, marginBottom: 0 }}
            placeholder="Type your message..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={!connected}
          />
          <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0 1.5rem' }} disabled={!connected || !inputMsg.trim()}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
