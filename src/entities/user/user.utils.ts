import { ACCOUNT_TYPES } from "./user.constants";

import { getStorageData } from "../../app/app.utils";
import { decrypt } from "../../api/crypt";

import type { IUpdateUser, IUserData } from "./model/user.types";

/**
 * Gets the user role type
 * @param user
 *
 * @return a value from RoleList
 */
export const getUserRole = (user: IUpdateUser): any => {
  if (user && user.account_type) {
    // TODO: refactor this
    for (const index in ACCOUNT_TYPES) {
      if (ACCOUNT_TYPES[index].id == user.account_type) {
        return ACCOUNT_TYPES[index];
      }
    }
  }

  return ACCOUNT_TYPES[0];
};

/**
 * Return User's data from the device storage
 * @return IUserData || null
 */
export const getUserLocalData = async (): Promise<IUserData | null> => {
  const store = await getStorageData();
  return store?.user || null;
};
