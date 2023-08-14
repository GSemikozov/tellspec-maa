import { accountTypesEnum } from "./model/user.types";

export const STORE_GROUP_KEY = 'group_key';

export const ACCOUNT_TYPES = [
  { id: accountTypesEnum.milk_bank, title: 'milk_bank' },
  { id: accountTypesEnum.doctor, title: 'doctor' }
];

export const MEMBER_TYPES = [
  { id: 'admin', title: 'Admin' },
  { id: 'member', title: 'Member' }
]
