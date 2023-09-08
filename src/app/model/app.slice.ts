import type {PayloadAction} from "@reduxjs/toolkit"

import { createSlice } from '@reduxjs/toolkit';

import { checkNetworkConnection } from '../app.utils';

import { fetchAppSettings } from './app.actions';

import type { IApp, IAlertActionPayload, IBackdropPayload } from "./app.types";

const initialState: IApp = {
    status: 'idle',
    online: false,
    layout: {
        isSidebarVisible: true,
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
            }
        },

        hideAlert: (state) => {
            state.alert.isAlertVisible = false;
        },

        showBackdrop: (state, action: PayloadAction<IBackdropPayload>) => {
            state.backdrop.backdropText = action.payload.backdropText;
            state.backdrop.delay = action.payload.delay || 1000;
            state.backdrop.isBackdropVisible = true;
        },

        hideBackdrop: (state) => {
            state.backdrop.isBackdropVisible = false;
        }
    },

    extraReducers: builder => {
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
