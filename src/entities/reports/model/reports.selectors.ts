import { isAfter, isBefore } from 'date-fns';

import { RootState } from '@app/store';
// import { createSelector } from "@reduxjs/toolkit";

import type { IReport } from './reports.types';

export const selectReportByMilkId =
    (milkId: string) =>
    (state: RootState): IReport | null => {
        const reports = state.reports.entities;
        const uuids = Object.keys(reports);

        if (!milkId || !uuids.length) {
            return null;
        }

        const uuid = uuids.find(uuid => reports[uuid].milk_id === milkId);

        return uuid ? reports[uuid] : null;
    };

export const selectAllReports = (state: RootState) => Object.values(state.reports.entities);

export const selectReportsByDate = (from?: string, to?: string) => (state: RootState) => {
    const reports = Object.values(state.reports.entities);

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
