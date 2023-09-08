import { RootState } from '../store';

export const selectAppState = (state: RootState) => state.app;

export const isAppFetching = (state: RootState) => state.app.status === 'loading';

export const isSidebarVisible = (state: RootState) => state.app.layout.isSidebarVisible;

export const getAlert = (state: RootState) => state.app.alert;
export const getBackdrop = (state: RootState) => state.app.backdrop;
