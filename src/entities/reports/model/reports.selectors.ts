import { RootState } from "../../../app/store";

import type { IReport } from "./reports.types";
export const selectReportByMilkId = (milkId: string) => (state: RootState): IReport | null => {
    const reports = state.reports.entities;
    const uuids = Object.keys(reports);

    if (!milkId || !uuids.length) {
        return null;
    }

    const uuid = uuids
        .find((uuid) => reports[uuid].milk_id === milkId);
    return uuid ? reports[uuid] : null;
}