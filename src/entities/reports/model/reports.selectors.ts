import { RootState } from '@app/store';

export const selectReportByMilkId = (milkId: string) => (state: RootState) => {
    if (!milkId) {
        return null;
    }

    const reports = state.reports.entities;
    const uuids = Object.keys(reports);

    if (!uuids.length) {
        return null;
    }

    const uuid = uuids.find(uuid => reports[uuid].milk_id === milkId);
    return uuid ? reports[uuid] : null;
};
