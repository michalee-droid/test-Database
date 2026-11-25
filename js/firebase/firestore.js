import {
  doc, getDoc, setDoc, serverTimestamp, arrayUnion, arrayRemove,
  collection, addDoc, query, orderBy, limit, getDocs, deleteDoc, runTransaction
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

// ==========================================
// WALLET & FINANSIAL
// ==========================================
export async function addWalletTransaction(uid, tx) {
  return runTransaction(db, async (transaction) => {
    const userRef = userDocRef(uid);
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) throw "User tidak ditemukan";
    
    let currentUang = userDoc.data().stats.uang || 0;
    let newUang = currentUang + tx.amount;
    
    if (newUang < 0) throw "Saldo tidak mencukupi!";
    
    transaction.update(userRef, { 'stats.uang': newUang, updatedAt: serverTimestamp() });
    const txRef = doc(collection(db, 'users', uid, 'transactions'));
    transaction.set(txRef, { ...tx, ts: serverTimestamp() });
    
    return newUang;
  });
}

export async function fetchTransactions(uid, max = 50) {
  const q = query(collection(db, 'users', uid, 'transactions'), orderBy('ts', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ==========================================
// PROPERTI
// ==========================================
export async function buyProperty(uid, propertyData, price) {
  return runTransaction(db, async (transaction) => {
    const userRef = userDocRef(uid);
    const userDoc = await transaction.get(userRef);
    const currentUang = userDoc.data().stats.uang || 0;
    
    if (currentUang < price) throw "Uang tidak cukup!";
    
    transaction.update(userRef, { 'stats.uang': currentUang - price, updatedAt: serverTimestamp() });
    const newProperty = { ...propertyData, boughtAt: new Date().toISOString(), condition: 100 };
    transaction.update(userRef, { properties: arrayUnion(newProperty) });
  });
}

// ==========================================
// KARIR
// ==========================================
export async function applyForJob(uid, jobData) {
  return runTransaction(db, async (transaction) => {
    const userRef = userDocRef(uid);
    const userDoc = await transaction.get(userRef);
    const stats = userDoc.data().stats;
    
    if (stats.energi < 20) throw "Energi tidak cukup!";
    if (stats.kelaparan < 10) throw "Anda terlalu lapar untuk bekerja!";
    
    transaction.update(userRef, { 
      'stats.energi': stats.energi - 20,
      'stats.kelaparan': stats.kelaparan - 10,
      'stats.uang': stats.uang + jobData.salary,
      updatedAt: serverTimestamp()
    });
  });
}
