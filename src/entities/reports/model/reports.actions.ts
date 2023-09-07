import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';

import type { IReport, IReportRequestParam } from './reports.types';

export const fetchReport = createAsyncThunk(
    'reports/fetch',
    async (data: IReportRequestParam): Promise<IReport[]> => {
        try {
            return await apiInstance.reports.fetchReport(data);
        } catch (error) {
            console.error(error);
            throw new Error("Can't fetch report. Try again later");
        }
    },
);
