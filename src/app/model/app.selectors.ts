import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const selectAppState = (state: RootState) => state.app;

export const isAppFetching = (state: RootState) => state.app.status === 'loading';

export const isSidebarVisible = (state: RootState) => state.app.layout.isSidebarVisible;

export const selectBluetoothState = createSelector(
    [selectAppState],
    appState => appState.bluetooth,
);

export const selectBluetoothHasPermssion = createSelector(
    [selectBluetoothState],
    appState => appState.permission === 'granted',
);
