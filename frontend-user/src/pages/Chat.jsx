import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatService from '../services/chatService';
import ChatBox from '../components/ChatBox';
import { toast } from 'react-hot-toast';

const Chat = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await ChatService.getConversations();
        
        let loadedConversations = data;
        let selected = null;

        // If we navigated here with intent to start a conversation
        if (location.state?.startConversationWith) {
          const newUser = location.state.startConversationWith;
          // Check if it's already in the list
          const exists = data.find(c => c.user_id === newUser.user_id || c.id === newUser.user_id);
          if (!exists) {
            // Append it to the list temporarily so we can chat
            loadedConversations = [{ user_id: newUser.user_id || newUser.id, name: newUser.name }, ...data];
            selected = loadedConversations[0];
          } else {
            selected = exists;
          }
        } else if (data.length > 0) {
          selected = data[0];
        }

        setConversations(loadedConversations);
        if (selected) {
          setActiveConversation({ user_id: selected.user_id || selected.id, name: selected.name });
        }
      } catch (error) {
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [location.state]);

  return (
    <div style={{ padding: '1rem', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)', display: 'none' }} id="chat-desktop-title">Messages</h1>
      <style>{`
        @media (min-width: 769px) {
          #chat-desktop-title { display: block !important; }
        }
        @media (max-width: 768px) {
          #chat-container { flex-direction: column !important; }
          #conversations-sidebar { 
            width: 100% !important; 
            display: ${activeConversation ? 'none' : 'flex'} !important; 
          }
          #chat-box-area { 
            display: ${activeConversation ? 'flex' : 'none'} !important; 
            height: 100% !important;
          }
        }
      `}</style>
      
      <div id="chat-container" style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Sidebar: Conversations List */}
        <div id="conversations-sidebar" className="glass-panel" style={{ width: '350px', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: 0 }}>Conversations</h3>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>Loading...</div>
            ) : conversations.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>No conversations yet.</div>
            ) : (
              conversations.map((conv) => (
                <div 
                  key={conv.user_id || conv.id}
                  onClick={() => setActiveConversation({ user_id: conv.user_id || conv.id, name: conv.name })}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-sm)', 
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    background: activeConversation?.user_id === (conv.user_id || conv.id) ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    border: activeConversation?.user_id === (conv.user_id || conv.id) ? '1px solid var(--color-primary)' : '1px solid transparent',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: 'var(--color-surface)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 'bold', fontSize: '1rem' 
                  }}>
                    {conv.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h4 style={{ margin: '0 0 0.2rem 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{conv.name}</h4>
                    {conv.last_message && (
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {conv.last_message}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Area: Chat Box */}
        <div id="chat-box-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ChatBox activeConversation={activeConversation} onBack={() => setActiveConversation(null)} />
        </div>

      </div>
    </div>
  );
};

export default Chat;
