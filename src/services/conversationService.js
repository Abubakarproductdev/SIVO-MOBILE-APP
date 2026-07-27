import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { apiRequest } from './apiClient';

const HISTORY_CACHE_PREFIX = '@sivo/history/';

function cacheKey() {
  return `${HISTORY_CACHE_PREFIX}${auth?.currentUser?.uid || 'guest'}`;
}

async function getLocalHistory() {
  const saved = await AsyncStorage.getItem(cacheKey());
  return saved ? JSON.parse(saved) : [];
}

async function setLocalHistory(history) {
  await AsyncStorage.setItem(cacheKey(), JSON.stringify(history));
  return history;
}

function mergeConversations(remote, local) {
  const byId = new Map();
  [...local, ...remote].forEach((item) => byId.set(item.id, item));
  return [...byId.values()].sort(
    (a, b) => new Date(b.endedAt || b.date || 0) - new Date(a.endedAt || a.date || 0)
  );
}

export async function fetchConversations() {
  const local = await getLocalHistory();
  try {
    const response = await apiRequest('/conversations', { timeoutMs: 5000 });
    const conversations = mergeConversations(response.conversations || [], local);
    await setLocalHistory(conversations);
    return conversations;
  } catch (error) {
    // History remains available while the hosted API is offline or unreachable.
    return local;
  }
}

export async function fetchConversation(id) {
  const local = await getLocalHistory();
  const cached = local.find((item) => item.id === id);
  try {
    const response = await apiRequest(`/conversations/${id}`, { timeoutMs: 5000 });
    return response.conversation || cached;
  } catch (error) {
    return cached;
  }
}

export async function saveConversation(conversation) {
  const now = new Date().toISOString();
  const localConversation = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: 'Live Conversation',
    title: 'Live Conversation',
    previewText: conversation.messages?.[0]?.text || '',
    messages: conversation.messages || [],
    date: conversation.endedAt || now,
    startedAt: conversation.startedAt || now,
    endedAt: conversation.endedAt || now,
  };

  const local = await getLocalHistory();
  await setLocalHistory(mergeConversations([localConversation], local));

  try {
    const response = await apiRequest('/conversations', {
      method: 'POST',
      body: conversation,
      timeoutMs: 5000,
    });
    const saved = response.conversation || localConversation;
    await setLocalHistory(mergeConversations([saved], local.filter((item) => item.id !== localConversation.id)));
    return saved;
  } catch (error) {
    return localConversation;
  }
}
