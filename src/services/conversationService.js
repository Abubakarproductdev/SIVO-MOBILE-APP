import { apiRequest } from './apiClient';

export async function fetchConversations() {
  const response = await apiRequest('/conversations');
  return response.conversations || [];
}

export async function fetchConversation(id) {
  const response = await apiRequest(`/conversations/${id}`);
  return response.conversation;
}

export async function saveConversation(conversation) {
  const response = await apiRequest('/conversations', {
    method: 'POST',
    body: conversation,
  });

  return response.conversation;
}
