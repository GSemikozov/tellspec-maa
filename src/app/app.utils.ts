import { decrypt } from '@api/shared';
import { NativeStorageKeys, nativeStore } from '@api/native';

import type { RootState } from './store';

export const getStorageData = async (): Promise<RootState | null> => {
    const state = await nativeStore.get(NativeStorageKeys.STATE);

    if (state) {
        const parsedState = JSON.parse(state);

        // console.info('Storage: get state', parsedState);

        return parsedState;
    }

    return null;
};

export const clearStorageData = async (): Promise<void> => {
    await nativeStore.remove(NativeStorageKeys.STATE);
    await nativeStore.remove(NativeStorageKeys.GROUP_KEY);
    await nativeStore.remove(NativeStorageKeys.DEVICE);
    await nativeStore.remove(NativeStorageKeys.DEVICE_CALIBRATION);
};

export const checkNetworkConnection = () => {
    return window.navigator.onLine;
};

export const saveGroupKey = async (data: string, password: string) => {
    const groupKey = await decrypt(data, password);

    return nativeStore.set(NativeStorageKeys.GROUP_KEY, groupKey);
};
