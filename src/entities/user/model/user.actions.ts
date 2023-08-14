import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from '../../../api';
import { clearStorageData } from "../../../app/app.utils";
import { userActions } from "./user.slice";

import type { ILoginData, IUserData } from "./user.types";

const api = new API();

export const isOnline = () => {
  return window.navigator.onLine
}

export const logout = createAsyncThunk(
  'user/logout',
  async (arg, thunkAPI): Promise<any> => {
    try {
      await api.users.logout();
      thunkAPI.dispatch(userActions.clearUser);
      await clearStorageData();
      window.location.replace('/login');
    } catch(error) {
      throw error
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (data: ILoginData): Promise<IUserData> => {
    try {
      if (!isOnline()) {
        throw 'Network is disconnected'
      }

      const response = await api.users.login(data);

      if (!response) {
        throw "Something went wrong. Try again later"
      }

      window.location.replace('/');
      return response
    } catch (error) {
      throw error
    }
  }
);
