import * as crypto from 'crypto-js';

import { NativeStorageKeys, nativeStore } from '@api/native';

/**
 * Encrypt method
 * @param data Data to encrypt
 * @param key Key used to encrypt
 */
export const encrypt = async (data: string, key: string | null = null) => {
    const token = key ? key : await nativeStore.get(NativeStorageKeys.GROUP_KEY);

    if (!token) {
        throw new Error('Cannot encrypt data. Set the group key first');
    }

    return crypto.AES.encrypt(data, token).toString();
};

/**
 * Decrypt method
 * @param data Data to decrypt
 * @param key Key used to decrypt
 */
export const decrypt = async (data: string, key: string | null = null) => {
    const token = key ? key : await nativeStore.get(NativeStorageKeys.GROUP_KEY);

    if (!token) {
        throw new Error('Cannot decrypt data. Set the group key first');
    }

    return crypto.AES.decrypt(data, token).toString(crypto.enc.Utf8);
};

export default { encrypt, decrypt };
