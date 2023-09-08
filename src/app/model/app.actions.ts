import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';
import { clearStorageData, getStorageData } from '@app/app.utils';
import { RootState } from '@app/store';

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
