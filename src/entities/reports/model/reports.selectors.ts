import { createSelector } from '@reduxjs/toolkit';
import { isAfter, isBefore } from 'date-fns';

import { RootState } from '@app/store';

const selectReportSliceState = (state: RootState) => state.reports;

export const selectReportList = createSelector([selectReportSliceState], reportsState =>
    Object.values(reportsState.byIds),
);

export const selectReportByMilkId = createSelector(
    [selectReportList, (_, milkId: string) => milkId],
    (reportList, milkId) => {
        const milk = reportList.find(report => report.milk_id === milkId);

        return milk ?? null;
    },
);

export const selectReportsByDate = (from?: string, to?: string) => (state: RootState) => {
    const reports = Object.values(state.reports.byIds);

    if (!from && !to) {
        return reports;
    }

    const startDate = from ? new Date(from) : new Date(0);
    const endDate = to ? new Date(to) : new Date();

    return reports.filter(report => {
        const reportCreatedDate = new Date(report.created_at);
        return isAfter(reportCreatedDate, startDate) && isBefore(reportCreatedDate, endDate);
    });
};
