import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';

import type { IReportRequestParam } from './reports.types';

export const fetchReport = createAsyncThunk('reports/fetch', async (data: IReportRequestParam) => {
    try {
        return apiInstance.reports.fetchReport(data);
    } catch (error) {
        console.error(error);
        throw new Error("Can't fetch report. Try again later");
    }
});
