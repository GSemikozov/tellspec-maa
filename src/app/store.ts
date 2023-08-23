import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from "../entities/user";
import { appReducer} from "./model/app.slice";
import { saveToStorage } from "../middlewares/storage";
import { userSelectors } from "../entities/user/";

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(saveToStorage)
  },
});

store.subscribe(() => {
  const token = userSelectors.getUserToken(store.getState());
  // setAuthHeader(token)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
