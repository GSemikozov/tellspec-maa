import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';
import { clearStorageData, saveGroupKey } from '@app/app.utils';

import { userActions } from './user.slice';

import type { ILoginData, IUserData } from './user.types';

export const isOnline = () => {
    return window.navigator.onLine;
};

export const logout = createAsyncThunk('user/logout', async (_, thunkAPI): Promise<any> => {
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
                throw 'Network is disconnected';
            }

            const response = await apiInstance.users.login(data);

            if (!response) {
                throw 'Something went wrong. Try again later';
            }

            await saveGroupKey(response.metadata.group_key, data.password);
            window.location.replace('/');
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
);
