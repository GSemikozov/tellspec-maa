import { createSlice } from '@reduxjs/toolkit';

import { fetchAppSettings } from '@app/model/app.actions';

import { login, logout } from './user.actions';
import { accountTypesEnum } from './user.types';

import type { IUserData } from './user.types';

const initialState: IUserData = {
    status: 'idle',
    token: '',
    pk: '',
    account_type: accountTypesEnum.milk_bank,
    email: '',
    first_name: '',
    username: '',
    last_name: '',
    company_name: '',
    country_code: '',
    metadata: {
        group_id: '',
        group_key: '',
        terms_accepted: false,
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser: () => {
            return initialState;
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchAppSettings.fulfilled, (state, action) => {
            const user = action.payload?.user;

            if (!user) {
                return state;
            }

            return {
                ...user,
                status: 'success',
            };
        });
        builder.addCase(login.pending, state => {
            state.status = 'loading';
        });
        builder.addCase(login.fulfilled, (_, action) => {
            return {
                ...action.payload,
                status: 'success',
            };
        });
        builder.addCase(login.rejected, state => {
            state.status = 'error';
        });
        builder.addCase(logout.pending, () => {});
        builder.addCase(logout.fulfilled, () => {
            return initialState;
        });
    },
});

export const userActions = userSlice.actions;

export const userReducer = userSlice.reducer;
