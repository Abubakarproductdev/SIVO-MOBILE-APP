import { auth } from '../config/firebase';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://sivoappbackend-gcfhedhphpezadck.eastasia-01.azurewebsites.net/api';

const REQUEST_TIMEOUT_MS = 15000;

export async function apiRequest(path, options = {}) {
  const currentUser = auth?.currentUser;

  if (!currentUser) {
    throw new Error('You must be signed in to continue.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || REQUEST_TIMEOUT_MS);

  let response;

  try {
    // Do not force a token refresh for every request: forcing it can block
    // history/settings when Firebase is briefly offline.
    const token = await currentUser.getIdToken();
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('API request timed out. Please check your connection and try again.');
    }

    throw new Error(error.message || 'Could not reach the API server. Please try again.');
  } finally {
    clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed. Please try again.');
  }

  return payload;
}
