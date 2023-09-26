import { createSelector } from '@reduxjs/toolkit';
import { isAfter, isBefore } from 'date-fns';

import { RootState } from '@app/store';

const selectReportSliceState = (state: RootState) => state.reports;

export const selectIsReportLoading = createSelector(
    [selectReportSliceState],
    reportsState => reportsState.status === 'loading',
);

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

export const selectReportScanIdByMilkId = createSelector([selectReportByMilkId], reportMilk => {
    if (!reportMilk || !reportMilk.data.analyseData) {
        return '';
    }

    return reportMilk.data.analyseData.scanId;
});

export const selectReportsByDate = createSelector(
    [selectReportList, (_, from = '', to = '') => [from, to]],
    (reportList, dateInterval) => {
        const [from, to] = dateInterval;

        if (!from && !to) {
            return reportList;
        }

        const startDate = from ? new Date(from) : new Date();
        const endDate = to ? new Date(to) : new Date();

        return reportList.filter(report => {
            const reportCreatedDate = new Date(report.created_at);

            return isAfter(reportCreatedDate, startDate) && isBefore(reportCreatedDate, endDate);
        });
    },
);
