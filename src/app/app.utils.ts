import { Storage } from "@ionic/storage";

import type { RootState } from "./store";

const Store = new Storage();

export const getStorageData = async (): Promise<RootState | null> => {
  const store = await Store.create();
  const state = await store.get('state');

  if (state) {
    const parsedState = JSON.parse(state);
    console.info('Storage: get state', parsedState);
    return parsedState;
  }

  return null;
}

export const clearStorageData = async (): Promise<void> => {
  try {
    const store = await Store.create();
    await store.clear();
  } catch (e) {
    throw e;
  }
}

export const checkNetworkConnection = () => {
  return window.navigator.onLine
}
