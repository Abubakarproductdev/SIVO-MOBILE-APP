import { apiRequest } from './apiClient';

export async function syncCurrentUser(displayName) {
  const payload = {};
  if (displayName) payload.displayName = displayName;

  const response = await apiRequest('/users/sync', {
    method: 'POST',
    body: payload,
  });

  return response.user;
}

export async function getCurrentUserProfile() {
  const response = await apiRequest('/users/me');
  return response.user;
}

export async function updateCurrentUserProfile(updates) {
  const response = await apiRequest('/users/me', {
    method: 'PATCH',
    body: updates,
  });

  return response.user;
}
