import { nativeStore, NativeStorageKeys } from './storage';

export const isEmulateNativeSdk = async (): Promise<boolean> => {
    return nativeStore.get(NativeStorageKeys.IS_EMULATE_NATIVE_SDK);
};
