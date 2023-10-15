import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';
import { buildAddReportRequestBody } from '@entities/reports/api';
import { reportsActions } from '@entities/reports';

import type { Milk } from '@entities/milk';

export const addMilk = createAsyncThunk('addMilkForm/fetch', async (data: Milk, { dispatch }) => {
    try {
        const addMilkResponse = await apiInstance.milk.addMilk(data);

        if (addMilkResponse.error) {
            throw new Error(addMilkResponse.error.message);
        }

        const report = buildAddReportRequestBody(data.milk_id);
        const addReportResponse = await apiInstance.reports.addReport(report);

        if (addReportResponse.error) {
            throw new Error(addReportResponse.error.message);
        }

        dispatch(reportsActions.addReport(report));
    } catch (error: any) {
        throw new Error(error.message ?? "Can't save milk. Try again later");
    }
});
