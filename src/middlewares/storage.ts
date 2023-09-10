import type { Action } from '@reduxjs/toolkit';

import { NativeStorageKeys, nativeStore } from '@api/native';

import type { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import type { RootState } from '@app/store';

export const saveToStorage: Middleware = ({ getState }: MiddlewareAPI) => {
    return (next: Dispatch) => (action: Action) => {
        const result = next(action);

        if (action.type.indexOf('app/fetching') !== -1) {
            return;
        }

        const state = getState();

        storeState(NativeStorageKeys.STATE, state);

        return result;
    };
};

const storeState = async (key: NativeStorageKeys, state: RootState) => {
    if (key !== null && key !== undefined) {
        await nativeStore.set(key, JSON.stringify(state));

        console.info('Storage: set state', state);
    }
};
