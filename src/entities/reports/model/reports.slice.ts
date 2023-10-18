import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { parseURL } from '@widgets/reports-widget/report-global-filter/report-global-filter.utils';
import { setEndDay, setStartDay } from '@ui/date-range';

import { fetchReport } from './reports.actions';

import type { Report } from '@entities/reports';
import type {
    ReportsSliceState,
    ReportsStatusFilterValues,
    SetDateFilterAction,
    ReportsFiltersState,
} from './reports.types';

const date = new Date();
const date7DaysAgo = new Date();
date7DaysAgo.setDate(date.getDate() - 7);
const fromDefaultDate = setStartDay(date7DaysAgo);
const toDefaultDate = setEndDay(date);

const filtersFromURL = parseURL();
const filter = {
    from: fromDefaultDate,
    to: toDefaultDate,
    status: 'analysed',
    name: '',
    ...filtersFromURL,
};

const initialState: ReportsSliceState = {
    status: 'idle',
    byIds: {},
    filter: filter as ReportsFiltersState,
};

export const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setReportsFilterByName: (state, action: PayloadAction<string>) => {
            state.filter.name = action.payload;
        },
        setReportsFilterByStatus: (state, action: PayloadAction<ReportsStatusFilterValues>) => {
            state.filter.status = action.payload;
        },
        setReportsFilterByDate: (state, action: PayloadAction<SetDateFilterAction>) => {
            state.filter = {
                ...state.filter,
                ...action.payload,
            };
        },
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
