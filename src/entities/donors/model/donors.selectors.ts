import { RootState } from '@app/store';

export const isDonorsFetching = (state: RootState) => state.donors.status === 'loading';
export const getAllDonors = (state: RootState) => state.donors.entities;
