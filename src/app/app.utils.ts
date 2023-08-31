import { Storage } from "@ionic/storage";
import { decrypt } from "../api/crypt";
import { STORE_GROUP_KEY } from "./app.constants";

import type { RootState } from "./store";

const Store = new Storage();

export const getStorageData = async (): Promise<RootState | null> => {
  const store = await Store.create();
  const state = await store.get("state");

  if (state) {
    const parsedState = JSON.parse(state);
    console.info("Storage: get state", parsedState);
    return parsedState;
  }

  return null;
};

export const clearStorageData = async (): Promise<void> => {
  try {
    const store = await Store.create();
    await store.clear();
  } catch (e) {
    throw e;
  }
};

export const checkNetworkConnection = () => {
  return window.navigator.onLine;
};

export const saveGroupKey = async (data: string, password: string) => {
  const store = new Storage();
  await store.create();
  const groupKey = await decrypt(data, password);
  return await store.set(STORE_GROUP_KEY, groupKey);
};
