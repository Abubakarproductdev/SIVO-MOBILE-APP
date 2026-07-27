import { auth, db, doc, setDoc, getDoc, updateDoc } from '../config/firebase';

export async function syncCurrentUser(displayName) {
  const currentUser = auth?.currentUser;
  if (!currentUser) throw new Error('User not authenticated');

  const userRef = doc(db, 'users', currentUser.uid);
  
  const payload = {
    uid: currentUser.uid,
    email: currentUser.email,
    lastLogin: new Date().toISOString(),
  };

  if (displayName) payload.displayName = displayName;

  await setDoc(userRef, payload, { merge: true });
  return payload;
}

export async function getCurrentUserProfile() {
  const currentUser = auth?.currentUser;
  if (!currentUser) throw new Error('User not authenticated');

  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
}

export async function updateCurrentUserProfile(updates) {
  const currentUser = auth?.currentUser;
  if (!currentUser) throw new Error('User not authenticated');

  const userRef = doc(db, 'users', currentUser.uid);
  await updateDoc(userRef, updates);
  
  return updates;
}
