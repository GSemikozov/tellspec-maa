import type { Report } from '../api';

export type ReportsSliceState = {
    status: 'idle' | 'loading' | 'success' | 'error';
    filter: ReportsFiltersState;
    byIds: Record<string, Report>;
};

export type ReportsStatusFilterValues = 'analysed' | 'unanalysed' | 'all';

export type ReportsFiltersState = {
    from: string;
    to: string;
    name: string;
    status: ReportsStatusFilterValues;
};

export type SetDateFilterAction = {
    from: string;
    to: string;
};
