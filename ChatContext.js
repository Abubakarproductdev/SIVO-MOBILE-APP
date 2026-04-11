import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // 1. Current Active Conversation
  const [messages, setMessages] = useState([]);
  
  // 2. Saved History (Array of past conversations)
  const [history, setHistory] = useState([]);

  // Add message to current chat
  const addMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // 3. NEW FUNCTION: End Conversation & Save to History
  const endConversation = () => {
    if (messages.length === 0) return; // Don't save empty chats

    const newHistoryItem = {
      id: Date.now().toString(),
      type: 'Sign → Speech', // Defaulting since this is the working module
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      previewText: messages[0].text, // Show first message as preview
      fullMessages: messages, // Save the whole chat content
      color: '#FF7F50', // Use your accent color (Hardcoded or from COLORS)
    };

    // Add to history (newest first)
    setHistory((prev) => [newHistoryItem, ...prev]);
    
    // Clear current chat
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, history, addMessage, endConversation }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);