import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const selectAppState = (state: RootState) => state.app;

export const getAlert = (state: RootState) => state.app.alert;
export const getBackdrop = (state: RootState) => state.app.backdrop;

export const selectIsAppFetching = createSelector(
    [selectAppState],
    appState => appState.status === 'loading',
);

export const selectIsSidebarOpen = createSelector(
    [selectAppState],
    appState => appState.layout.isSidebarVisible,
);

export const selectBleState = createSelector([selectAppState], appState => appState.ble);
export const selectBleStatus = createSelector([selectBleState], bleState => bleState.status);
