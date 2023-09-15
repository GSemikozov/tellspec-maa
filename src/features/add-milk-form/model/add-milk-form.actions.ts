import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';
import { buildAddReportRequestBody } from '@entities/reports/api';

import type { Milk } from '@entities/milk';

export const addMilk = createAsyncThunk('addMilkForm/fetch', async (data: Milk) => {
    try {
        await apiInstance.milk.addMilk(data);
        await apiInstance.reports.addReport(buildAddReportRequestBody(data.milk_id));
    } catch (error) {
        console.error(error);
        throw new Error("Can't save milk. Try again later");
    }
});
