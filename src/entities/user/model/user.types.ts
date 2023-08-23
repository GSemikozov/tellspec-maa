export enum accountTypesEnum {
  milk_bank,
  doctor,
}

export interface ILoginData {
  username?: string;
  email: string;
  password: string;
}

export interface IUserMetaData {
  group_id: string;
  group_key: string;
  forceMobile? : boolean,
  enSensorEmulation? : boolean,
  terms_accepted: boolean;
  created_by_admin? : string | boolean;
  password_reset_required?: boolean; // The user password needs resetting.
}

export interface IReturnLogin {
  data: {
    key: string;
    user: IUserData;
  };
}

export interface IUpdateUser {
  email: string;
  username?: string,
  first_name: string;
  last_name: string;
  company_name?: string;
  country_code?: string;
  tags?: [];
  metadata: IUserMetaData;
  account_type: accountTypesEnum;
}

export interface IUserData extends IUpdateUser {
  status: 'idle' | 'loading' | 'success' | 'error';
  token: string;
  pk: string;
}
