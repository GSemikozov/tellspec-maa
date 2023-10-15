import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { fetchReport } from './reports.actions';

import type { ReportsSliceState } from './reports.types';
import type { Report } from '@entities/reports';

const initialState: ReportsSliceState = {
    status: 'idle',
    byIds: {},
};

export const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        addReport: (state, action: PayloadAction<Report>) => {
            state.byIds = {
                ...state.byIds,
                [action.payload.uuid]: action.payload,
            };
        },
    },
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
