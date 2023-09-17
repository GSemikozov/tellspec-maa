import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

export const selectUserState = (state: RootState) => state.user;
export const selectUserEmail = createSelector([selectUserState], userState => userState.email);

export const isUserFetching = (state: RootState) => state.user.status === 'loading';
export const isUserAuthenticated = (state: RootState) => parseInt(state.user.pk) >= 0;
export const getStatus = (state: RootState) => state.user.status;
export const getError = (state: RootState) => state.user.error;
export const getUser = (state: RootState) => state.user;
export const getUserToken = (state: RootState) => state.user.token;
export const selectGroupId = (state: RootState) => state.user.metadata.group_id;
