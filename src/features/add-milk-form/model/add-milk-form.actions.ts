import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';
import { buildAddReportRequestBody } from '@entities/reports/api';

import type { Milk } from '@entities/milk';

export const addMilk = createAsyncThunk('addMilkForm/fetch', async (data: Milk) => {
    try {
        const addMilkResponse = await apiInstance.milk.addMilk(data);

        if (addMilkResponse.error) {
            throw new Error(addMilkResponse.error.message);
        }

        const addReportResponse = await apiInstance.reports.addReport(
            buildAddReportRequestBody(data.milk_id),
        );

        if (addReportResponse.error) {
            throw new Error(addReportResponse.error.message);
        }
    } catch (error: any) {
        throw new Error(error.message ?? "Can't save milk. Try again later");
    }
});
