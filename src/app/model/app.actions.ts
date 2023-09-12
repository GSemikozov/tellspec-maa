import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';
import { clearStorageData, getStorageData } from '@app/app.utils';
import { RootState } from '@app/store';
import { retrieveBlePermissions } from '@api/native';

type State = RootState | null;

export const fetchAppSettings = createAsyncThunk('app/fetching', async (): Promise<State> => {
    const storageState = await getStorageData();

    if (storageState) {
        const checkTokenResponse = await apiInstance.users.checkToken();

        if (checkTokenResponse.error?.code) {
            await clearStorageData();
            window.location.replace('/login');
            return null;
        }

        return storageState;
    }

    return null;
});

export const fetchBleStatus = createAsyncThunk(
    'app/fetch-ble-status',
    async (): Promise<boolean> => {
        const hasPermissions = await retrieveBlePermissions();

        console.log('[fetchBleStatus]', hasPermissions);

        return hasPermissions;
    },
);
