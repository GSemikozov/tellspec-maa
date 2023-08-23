import { RootState } from "../store";

export const isAppFetching = (state: RootState) => state.app.status === 'loading';
