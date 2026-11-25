import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { auth } from './config.js';

export function watchAuth(cb) { return onAuthStateChanged(auth, cb); }

export async function ensureAuth() {
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}

export const loginEmail = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
export const registerEmail = (email, pass) => createUserWithEmailAndPassword(auth, email, pass);
export const logout = () => signOut(auth);
export const getUid = () => auth.currentUser?.uid ?? null;
