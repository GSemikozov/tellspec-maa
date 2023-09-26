import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';

import type { FetchReportRequest } from '../api';

export const fetchReport = createAsyncThunk(
    'reports/fetch',
    async (data: FetchReportRequest = {}) => {
        try {
            const response = await apiInstance.reports.fetchReport(data);

            if (response.data === null) {
                throw new Error('An error occured while fetch reports');
            }

            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error("Can't fetch report. Try again later");
        }
    },
);
