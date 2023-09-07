import { createSlice } from '@reduxjs/toolkit';

import { checkNetworkConnection } from '../app.utils';

import { fetchAppSettings } from './app.actions';

import type { IApp } from './app.types';

const initialState: IApp = {
    status: 'idle',
    online: false,
    layout: {
        isSidebarVisible: true,
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
