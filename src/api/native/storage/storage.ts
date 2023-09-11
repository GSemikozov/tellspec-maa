import { Storage } from '@ionic/storage';

import { NativeStorageKeys } from './types';

let nativeStorage: Storage | null = null;

export const nativeStore = {
    createStore: async () => {
        nativeStorage = new Storage();

        await nativeStorage.create();
    },

    set: async (key: NativeStorageKeys, value: any) => {
        if (!nativeStorage) {
            return;
        }

        await nativeStorage.set(key, value);

        // let toStoreValue = value;
        //
        // if (typeof value === 'object') {
        //     toStoreValue = JSON.stringify(value);
        // }
        //
        // await nativeStorage.set(key, toStoreValue);
    },

    get: async (key: NativeStorageKeys) => {
        if (!nativeStorage) {
            return null;
        }

        return nativeStorage.get(key);

        // try {
        //     const storageValue = await nativeStorage.get(key);
        //
        //     return JSON.parse(storageValue);
        // } catch {
        //     return nativeStorage.get(key);
        // }
    },

    remove: async (key: NativeStorageKeys) => {
        if (!nativeStorage) {
            return null;
        }

        await nativeStorage.remove(key);
    },

    clear: async () => {
        if (!nativeStorage) {
            return null;
        }

        await nativeStorage.clear();
    },
};
