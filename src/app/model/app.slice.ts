import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { checkNetworkConnection } from '../app.utils';

import { fetchAppSettings, fetchBleStatus } from './app.actions';
import { BleStatus } from './app.types';

import type { IApp, IAlertActionPayload, IBackdropPayload } from './app.types';

const initialState: IApp = {
    status: 'loading',
    online: false,
    ble: {
        status: BleStatus.OFF,
    },
    layout: {
        isSidebarVisible: true,
        className: '',
    },
    alert: {
        isAlertVisible: false,
        alertHeader: '',
        alertSubHeader: '',
        alertMessage: '',
    },
    backdrop: {
        isBackdropVisible: false,
        backdropText: '',
        delay: 1000,
    },
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLayoutClassName: (state, action) => {
            state.layout.className = action.payload;
        },

        hideSidebar: state => {
            state.layout.isSidebarVisible = false;
        },

        showSidebar: state => {
            state.layout.isSidebarVisible = true;
        },

        showAlert: (state, action: PayloadAction<IAlertActionPayload>) => {
            state.alert = {
                ...action.payload,
                isAlertVisible: true,
            };
        },

        hideAlert: state => {
            state.alert.isAlertVisible = false;
        },

        showBackdrop: (state, action: PayloadAction<IBackdropPayload>) => {
            state.backdrop.backdropText = action.payload.backdropText;
            state.backdrop.delay = action.payload.delay || 1000;
            state.backdrop.isBackdropVisible = true;
        },

        hideBackdrop: state => {
            state.backdrop.isBackdropVisible = false;
        },
    },

    extraReducers: builder => {
        builder.addCase(fetchAppSettings.pending, state => {
            state.status = 'loading';
            state.online = checkNetworkConnection();
        });

        builder.addCase(fetchAppSettings.fulfilled, (state, action) => {
            return {
                ...state,
                ...action.payload?.app,
                status: 'success',
            };
        });

        builder.addCase(fetchAppSettings.rejected, state => {
            state.status = 'error';
        });

        builder.addCase(fetchBleStatus.rejected, state => {
            state.ble.status = BleStatus.OFF;
        });

        builder.addCase(fetchBleStatus.fulfilled, state => {
            state.ble.status = BleStatus.ON;
        });
    },
});

export const appActions = appSlice.actions;

export const appReducer = appSlice.reducer;
