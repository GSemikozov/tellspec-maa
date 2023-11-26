import React from 'react';

import { usePreemieToast } from '@ui';
import { apiInstance } from '@api/network';
import { useEventAsync } from '@shared/hooks';

import type { FetchReportRequest, Report } from '@entities/reports';

export type UseAnalyseMilkReportOptions<T = Report> = {
    onComplete?: (data: T) => Promise<void>;
};

export type UseAnalyseMilkReportResponse<T = Report> = [
    (payload: FetchReportRequest) => Promise<T | null>,
    (report: Report | null) => void,
    { report: T | null; loading: boolean },
];

export const useAnalyseMilkReport = ({
    onComplete,
}: UseAnalyseMilkReportOptions = {}): UseAnalyseMilkReportResponse => {
    const handleOnCompleteEvent = useEventAsync(onComplete);

    const [presentToast] = usePreemieToast();

    const [report, setReport] = React.useState<Report | null>(null);
    const [loading, setLoading] = React.useState(false);

    const fetchReport = React.useCallback(async (payload: FetchReportRequest) => {
        try {
            setLoading(true);

            const response = await apiInstance.reports.fetchReport(payload);

            if (response.data === null || response.data.length === 0) {
                throw new Error('Unable to find milk information');
            }

            const [report] = response.data;

            setReport(report);

            handleOnCompleteEvent(report);

            return report;
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error.message,
            });
        } finally {
            setLoading(false);
        }

        return null;
    }, []);

    const handleSetReport = React.useCallback((newReport: Report | null) => {
        setReport(newReport);
    }, []);

    return [fetchReport, handleSetReport, { report, loading }];
};
