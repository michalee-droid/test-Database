import { ensureAuth } from '../firebase/auth.js';
import {
  fetchUserState, pushUserState,
  addJournalEntry, fetchRecentJournal, clearJournal, 
  addWalletTransaction, fetchTransactions // PERBAIKAN: addTransaction -> addWalletTransaction
} from '../firebase/firestore.js';
import { setState, getState } from './state.js';

let currentUid = null;
let saveTimer = null;

export async function bootstrapState() {
  const user = await ensureAuth();
  currentUid = user.uid;
  const remote = await fetchUserState(currentUid);
  setState(remote);
  return remote;
}

export function saveState(immediate = false) {
  if (!currentUid) return;
  if (immediate) { pushUserState(currentUid, getState()).catch(console.warn); return; }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    pushUserState(currentUid, getState()).catch(console.warn);
  }, 600);
}

export function flushSave() {
  clearTimeout(saveTimer);
  if (currentUid) pushUserState(currentUid, getState()).catch(console.warn);
}

export const journal = {
  add: (entry) => currentUid && addJournalEntry(currentUid, entry),
  recent: (max = 30) => currentUid && fetchRecentJournal(currentUid, max),
  clear: () => currentUid && clearJournal(currentUid),
};

export const wallet = {
  transact: (tx) => currentUid && addWalletTransaction(currentUid, tx),
  history: (max = 50) => currentUid && fetchTransactions(currentUid, max),
};

export const getUid = () => currentUid;
