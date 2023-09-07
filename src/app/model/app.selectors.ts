import { RootState } from '../store';

export const selectAppState = (state: RootState) => state.app;

export const isAppFetching = (state: RootState) => state.app.status === 'loading';

export const isSidebarVisible = (state: RootState) => state.app.layout.isSidebarVisible;
