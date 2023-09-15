import { createSlice } from '@reduxjs/toolkit';

import { fetchReport } from './reports.actions';

import type { ReportsSliceState } from './reports.types';

const initialState: ReportsSliceState = {
    status: 'idle',
    byIds: {},
};

export const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchReport.pending, state => {
            state.status = 'loading';
        });
        builder.addCase(fetchReport.fulfilled, (state, action) => {
            state.status = 'success';

            const reports = action.payload.reduce((carry, report) => {
                carry[report.uuid] = report;

                return carry;
            }, {});

            state.byIds = {
                ...state.byIds,
                ...reports,
            };
        });
        builder.addCase(fetchReport.rejected, state => {
            state.status = 'error';
        });
    },
});

export const reportsActions = reportsSlice.actions;

export const reportsReducer = reportsSlice.reducer;
