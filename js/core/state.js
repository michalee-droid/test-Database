import { defaultState } from './default-state.js';

let state = structuredClone(defaultState);
const listeners = new Set();

export function setState(next) {
  state = next;
  listeners.forEach(fn => fn(state));
}

export function patchState(patch) {
  state = { ...state, ...patch };
  listeners.forEach(fn => fn(state));
}

export function getState() { return state; }

export function subscribe(fn) {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}
