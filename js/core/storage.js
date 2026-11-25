import { ensureAuth } from '../firebase/auth.js';
import {
  fetchUserState, pushUserState,
  addJournalEntry, fetchRecentJournal, clearJournal, 
  addWalletTransaction, fetchTransactions
} from '../firebase/firestore.js';
import { setState, getState } from './state.js';

let currentUid = null;
let saveTimer = null;

export async function bootstrapState() {
  const user = await ensureAuth();
  currentUid = user.uid;
  try {
    const remote = await fetchUserState(currentUid);
    setState(remote);
    return remote;
  } catch (error) {
    console.warn("Gagal memuat dari server (Offline Mode), menggunakan state lokal.");
    // State lokal akan digunakan (dari defaultState karena belum ada override)
  }
}

export function saveState(immediate = false) {
  if (!currentUid) return;
  
  const doSave = () => {
    pushUserState(currentUid, getState()).catch(err => {
      // Hanya tampilkan warning, jangan crash game
      console.warn("⚠️ Gagal sinkronisasi ke Firebase (Pastikan internet menyala):", err.message);
    });
  };

  if (immediate) { doSave(); return; }
  
  clearTimeout(saveTimer);
  saveTimer = setTimeout(doSave, 600);
}

export function flushSave() {
  clearTimeout(saveTimer);
  if (currentUid) {
    pushUserState(currentUid, getState()).catch(err => console.warn("Save flush gagal:", err.message));
  }
}

export const journal = {
  add: (entry) => currentUid && addJournalEntry(currentUid, entry).catch(console.warn),
  recent: (max = 30) => currentUid && fetchRecentJournal(currentUid, max).catch(() => []),
  clear: () => currentUid && clearJournal(currentUid).catch(console.warn),
};

export const wallet = {
  transact: (tx) => currentUid && addWalletTransaction(currentUid, tx),
  history: (max = 50) => currentUid && fetchTransactions(currentUid, max).catch(() => []),
};

export const getUid = () => currentUid;
