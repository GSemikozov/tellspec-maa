import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';
import { clearStorageData, saveGroupKey } from '@app/app.utils';
import { tellspecDisconnect } from '@api/native';

import { userActions } from './user.slice';

import type { ILoginData, IUserData } from './user.types';

export const isOnline = () => {
    return window.navigator.onLine;
};

export const logout = createAsyncThunk('user/logout', async (_, thunkAPI): Promise<any> => {
    await tellspecDisconnect();
    await apiInstance.users.logout();

    thunkAPI.dispatch(userActions.clearUser);

    await clearStorageData();
    window.location.replace('/login');
});

export const login = createAsyncThunk(
    'user/login',
    async (data: ILoginData): Promise<IUserData> => {
        try {
            if (!isOnline()) {
                throw new Error('Network is disconnected');
            }

            const response = await apiInstance.users.login(data);

            if (!response) {
                throw new Error('Something went wrong. Try again later');
            }

            await saveGroupKey(response.metadata.group_key, data.password);

            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
);

export const resetPassword = createAsyncThunk(
    'user/reset-password',
    async (email: string): Promise<void> => {
        const response = await apiInstance.users.resetPassword(email);

        if (!response) {
            throw new Error('Something went wrong. Try again later');
        }
    },
);
