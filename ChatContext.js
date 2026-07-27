import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { auth, onAuthStateChanged } from './src/config/firebase';
import { fetchConversations, saveConversation } from './src/services/conversationService';

const ChatContext = createContext();

function makeClientId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeTimestamp(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [conversationStartedAt, setConversationStartedAt] = useState(null);
  const historyRequestRef = useRef(null);

  const loadHistory = useCallback(async () => {
    if (!auth?.currentUser) {
      setHistory([]);
      return [];
    }

    // Auth state and the History screen can request this at the same time.
    // Reuse the active request instead of showing two loaders/errors.
    if (historyRequestRef.current) return historyRequestRef.current;

    setHistoryLoading(true);
    historyRequestRef.current = fetchConversations()
      .then((conversations) => {
        setHistory(conversations);
        return conversations;
      })
      .finally(() => {
        historyRequestRef.current = null;
        setHistoryLoading(false);
      });

    return historyRequestRef.current;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        loadHistory().catch((error) => console.log('History load error:', error.message));
      } else {
        setMessages([]);
        setHistory([]);
        setConversationStartedAt(null);
      }
    });

    return unsubscribe;
  }, [loadHistory]);

  const addMessage = useCallback((text, direction = 'sign-to-speech') => {
    const cleanText = typeof text === 'string' ? text.trim() : '';
    if (!cleanText) return null;

    const now = new Date();
    const normalizedDirection = direction === 'speech-to-sign' ? 'speech-to-sign' : 'sign-to-speech';
    const newMessage = {
      id: makeClientId(),
      text: cleanText,
      direction: normalizedDirection,
      source: normalizedDirection === 'speech-to-sign' ? 'speech' : 'sign',
      timestamp: makeTimestamp(now),
      createdAt: now.toISOString(),
    };

    setConversationStartedAt((current) => current || now.toISOString());
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  const endConversation = useCallback(async () => {
    if (messages.length === 0) return null;

    const saved = await saveConversation({
      messages,
      startedAt: conversationStartedAt || messages[0].createdAt,
      endedAt: new Date().toISOString(),
    });

    setHistory((prev) => [saved, ...prev.filter((item) => item.id !== saved.id)]);
    setMessages([]);
    setConversationStartedAt(null);
    return saved;
  }, [conversationStartedAt, messages]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        history,
        historyLoading,
        addMessage,
        endConversation,
        loadHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
