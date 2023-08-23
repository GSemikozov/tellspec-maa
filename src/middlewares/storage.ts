import { Dispatch, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { Storage } from "@ionic/storage";

import type { Action } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

const store = new Storage();

export const saveToStorage: Middleware = ({ getState }: MiddlewareAPI) => {
  return (next: Dispatch) => (action: Action) => {
    const result = next(action);

    if (action.type.indexOf('app/fetching') !== -1) {
      return
    }

    const state = getState();
    storeState("state", state);
    return result;
  }
}

async function storeState(key: string, state: RootState) {
  if (key !== null && key !== undefined) {
    await store.create();
    await store.set(key, JSON.stringify(state));
    console.info('Storage: set state', state);
  }
}

