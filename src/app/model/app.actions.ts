import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';
import { checkBlePermission, requestBlePermissions } from '@api/native';
import { clearStorageData, getStorageData } from '@app/app.utils';
import { store, RootState } from '@app/store';

import type { BluetoothPermission } from './app.types';

type State = RootState | null;

export const fetchAppSettings = createAsyncThunk('app/fetching', async (): Promise<State> => {
    const state = await getStorageData();

    if (state) {
        const checkTokenResponse = await apiInstance.users.checkToken();

        if (checkTokenResponse.error?.code) {
            await clearStorageData();
            window.location.replace('/login');
            return null;
        }

        return state;
    } else {
        return null;
    }
});

export const retrieveBlePermissions = createAsyncThunk(
    'app/retrieveBlePermissions',
    async (): Promise<BluetoothPermission> => {
        const state = store.getState();

        try {
            const hasBlePermissions = await checkBlePermission();

            if (!hasBlePermissions) {
                return requestBlePermissions();
            }

            return state.app.bluetooth.permission;
        } catch (error) {
            console.error('[retrieveBlePermissions]', error);

            return 'denied';
        }
    },
);
