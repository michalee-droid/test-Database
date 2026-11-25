import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
  collection, addDoc, query, orderBy, limit, getDocs, deleteDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { db } from './config.js';
import { defaultState } from '../core/default-state.js';

const userDocRef = (uid) => doc(db, 'users', uid);

export async function fetchUserState(uid) {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) {
    const fresh = { ...defaultState, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    await setDoc(userDocRef(uid), fresh);
    return structuredClone(defaultState);
  }
  return snap.data();
}

export async function pushUserState(uid, state) {
  const { createdAt, updatedAt, ...payload } = state;
  await setDoc(userDocRef(uid), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function patchUserFields(uid, patch) {
  await updateDoc(userDocRef(uid), { ...patch, updatedAt: serverTimestamp() });
}

export async function addJournalEntry(uid, entry) {
  return addDoc(collection(db, 'users', uid, 'journal'), { ...entry, ts: serverTimestamp() });
}

export async function fetchRecentJournal(uid, max = 30) {
  const q = query(collection(db, 'users', uid, 'journal'), orderBy('ts', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function clearJournal(uid) {
  const q = query(collection(db, 'users', uid, 'journal'));
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
}

export async function addTransaction(uid, tx) {
  return addDoc(collection(db, 'users', uid, 'transactions'), { ...tx, ts: serverTimestamp() });
}
