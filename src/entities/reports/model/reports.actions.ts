import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';

import type { RootState } from '@app/store';

export const fetchReport = createAsyncThunk('reports/fetch', async (_, thunkAPI) => {
    const { reports } = thunkAPI.getState() as RootState;
    const { filter } = reports;
    const { from, to } = filter || {};

    try {
        const response = await apiInstance.reports.fetchReport({
            last_modified_gte: from,
            last_modified_lte: to,
        });

        if (response.data === null) {
            throw new Error('An error occurred while fetch reports');
        }

        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Can't fetch report. Try again later");
    }
});
