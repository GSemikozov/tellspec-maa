import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';

import type { IDonor, IDonorAllRequestData } from './donors.types';

export const fetchDonors = createAsyncThunk(
    'donors/fetch',
    async (data: IDonorAllRequestData): Promise<IDonor[]> => {
        const { completeData, showArchived } = data;

        try {
            return apiInstance.donors.getAllDonors(completeData, showArchived);
        } catch (error) {
            console.error(error);
            throw new Error("Can't fetch donors list. Try again later");
        }
    },
);
