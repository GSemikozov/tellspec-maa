import type { ReportAnalyseDataResult } from '@entities/reports';

export type PrintData = {
    milkId: string;
    data: ReportAnalyseDataResult[];
    width: string;
    height: string;
    rotation?: string;
};
