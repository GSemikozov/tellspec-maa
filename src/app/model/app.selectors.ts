import { RootState } from "../store";

export const isAppFetching = (state: RootState) => state.app.status === 'loading';

export const isSidebarVisible = (state: RootState) => state.app.layout.isSidebarVisible;
