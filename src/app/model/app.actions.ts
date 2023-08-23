import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { API } from "../../api";
import { clearStorageData, getStorageData } from "../app.utils";

type State = RootState | null;

const api = new API();

export const fetchAppSettings = createAsyncThunk(
  'app/fetching',
  async (_, thunkAPI): Promise<State> => {
    try {
      const state = await getStorageData();

      if (state) {
        const checkTokenResponse = await api.users.checkToken();

        if (checkTokenResponse.error?.code) {
          await clearStorageData();
          window.location.replace('/login');
          return null;
        }

        return state;
      } else {
        return null
      }
    } catch (e) {
      throw e
    }
  }
);
