import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { apiRequest } from './apiClient';

const PROFILE_CACHE_PREFIX = '@sivo/profile/';

function cacheKey() {
  return `${PROFILE_CACHE_PREFIX}${auth?.currentUser?.uid || 'guest'}`;
}

function defaultProfile() {
  const currentUser = auth?.currentUser;
  return {
    email: currentUser?.email || '',
    displayName: currentUser?.displayName || '',
    phone: '',
    settings: { notificationsEnabled: true },
    createdAt: currentUser?.metadata?.creationTime || null,
  };
}

async function readCachedProfile() {
  const saved = await AsyncStorage.getItem(cacheKey());
  return saved ? { ...defaultProfile(), ...JSON.parse(saved) } : defaultProfile();
}

async function cacheProfile(profile) {
  await AsyncStorage.setItem(cacheKey(), JSON.stringify(profile));
  return profile;
}

// Profiles belong to the Express API.  The earlier Firestore calls did not
// match the backend and could leave Settings waiting on Firestore rules.
export async function syncCurrentUser(displayName) {
  const cached = await readCachedProfile();
  const optimistic = {
    ...cached,
    ...(displayName ? { displayName } : {}),
    email: auth?.currentUser?.email || cached.email,
  };
  await cacheProfile(optimistic);

  try {
    const response = await apiRequest('/users/sync', {
      method: 'POST',
      body: displayName ? { displayName } : {},
      timeoutMs: 5000,
    });
    return cacheProfile(response.user || optimistic);
  } catch (error) {
    // Account access should not be blocked just because profile sync is offline.
    return optimistic;
  }
}

export async function getCurrentUserProfile() {
  const cached = await readCachedProfile();

  // Render cached/default data immediately.  Refresh it opportunistically so
  // Settings never remains on a loader while a server is slow or offline.
  apiRequest('/users/me', { timeoutMs: 5000 })
    .then((response) => cacheProfile(response.user || cached))
    .catch(() => {});

  return cached;
}

export async function updateCurrentUserProfile(updates) {
  const cached = await readCachedProfile();
  const optimistic = {
    ...cached,
    ...updates,
    settings: {
      ...cached.settings,
      ...(typeof updates.notificationsEnabled === 'boolean'
        ? { notificationsEnabled: updates.notificationsEnabled }
        : {}),
    },
  };
  await cacheProfile(optimistic);

  try {
    const response = await apiRequest('/users/me', {
      method: 'PATCH',
      body: updates,
      timeoutMs: 5000,
    });
    return cacheProfile(response.user || optimistic);
  } catch (error) {
    return optimistic;
  }
}
