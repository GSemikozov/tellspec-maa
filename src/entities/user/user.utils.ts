import { ACCOUNT_TYPES } from "./user.constants";

import type { IUpdateUser } from "./model/user.types";

/**
 * Gets the user role type
 * @param user
 *
 * @return a value from RoleList
 */
export const getUserRole = (user : IUpdateUser) : any => {
  if(user && user.account_type) {
    // TODO: refactor this
    for(const index in ACCOUNT_TYPES) {
      if(ACCOUNT_TYPES[index].id == user.account_type) {
        return ACCOUNT_TYPES[index];
      }
    }
  }

  return ACCOUNT_TYPES[0];
}
