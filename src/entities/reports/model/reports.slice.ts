import { createSlice } from '@reduxjs/toolkit';

import { fetchReport } from './reports.actions';

import type { IReport } from './reports.types';

interface ReportsState {
    status: 'idle' | 'loading' | 'success' | 'error';
    entities: Record<string, IReport>;
}

const initialState: ReportsState = {
    status: 'idle',
    entities: {},
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
            const reports = action.payload.reduce((prevValue, currValue) => {
                return {
                    ...prevValue,
                    [currValue.uuid]: currValue,
                };
            }, {});

            state.entities = {
                ...state.entities,
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
