import { v4 as uuid } from 'uuid';

import { ReportCategory } from './types';

import type { Report } from './types';

export const buildAddReportRequestBody = (milkId: string) => {
    const timestamp = new Date().toISOString();

    const requestBody: Report = {
        uuid: uuid(),
        milk_id: milkId,
        category: ReportCategory.milk,
        archived: false,
        archived_at: timestamp,
        created_at: timestamp,
        last_modified_at: timestamp,
        data: {
            TrackerNotification: [],
        },
    };

    return requestBody;
};

export const extractReportAnalyseData = (report: Report | null) => {
    return report?.data?.analyseData ?? null;
};
