import type { Report } from '../api';

export type ReportsSliceState = {
    status: 'idle' | 'loading' | 'success' | 'error';
    byIds: Record<string, Report>;
};
