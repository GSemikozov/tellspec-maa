import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { checkNetworkConnection } from '../app.utils';

import { fetchAppSettings, retrieveBlePermissions } from './app.actions';
import { BluetoothStatus } from './app.types';

import type { IApp } from './app.types';

const initialState: IApp = {
    status: 'idle',
    online: false,
    bluetooth: {
        status: BluetoothStatus.OFF,
        permission: 'denied',
    },
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setBluetoothStatus: (state, action: PayloadAction<BluetoothStatus>) => {
            state.bluetooth.status = action.payload;
        },
    },

    extraReducers: builder => {
        builder.addCase(retrieveBlePermissions.fulfilled, (state, action) => {
            state.bluetooth.permission = action.payload;
        });

        builder.addCase(fetchAppSettings.pending, state => {
            state.status = 'loading';
            state.online = checkNetworkConnection();
        });

        builder.addCase(fetchAppSettings.fulfilled, (state, action) => {
            return {
                ...state,
                status: 'success',
                ...action.payload?.app,
            };
        });

        builder.addCase(fetchAppSettings.rejected, state => {
            state.status = 'error';
        });
    },
});

export const appActions = appSlice.actions;

export const appReducer = appSlice.reducer;
