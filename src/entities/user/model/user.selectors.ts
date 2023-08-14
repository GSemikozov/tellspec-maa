import { RootState } from "../../../app/store";

export const isUserFetching = (state: RootState) => state.user.status === 'loading';
export const isUserAuthenticated = (state: RootState) => parseInt(state.user.pk) >= 0;
export const getUser = (state: RootState) => state.user;
export const getUserToken = (state: RootState) => state.user.token;
