import * as crypto from "crypto-js";
import { Storage } from "@ionic/storage";
import { STORE_GROUP_KEY } from "../app/app.constants";

export const getKey = async () => {
  const store = new Storage();
  await store.create();
  return store.get(STORE_GROUP_KEY);
};

/**
 * Encrypt method
 * @param data Data to encrypt
 * @param key Key used to encrypt
 */
export const encrypt = async (data: string, key: string | null = null) => {
  let token = key ? key : await getKey();

  if (!token) {
    throw new Error("Cannot encrypt data. Set the group key first");
  }

  return crypto.AES.encrypt(data, token).toString();
};

/**
 * Decrypt method
 * @param data Data to decrypt
 * @param key Key used to decrypt
 */
export const decrypt = async (data: string, key: string | null = null) => {
  let token = key ? key : await getKey();

  if (!token) {
    throw new Error("Cannot decrypt data. Set the group key first");
  }

  return crypto.AES.decrypt(data, token).toString(crypto.enc.Utf8);
};

export default { encrypt, decrypt };
