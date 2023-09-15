import type { Milk } from '../api';

export type MilkSliceState = {
    status: 'idle' | 'loading' | 'success' | 'error';
    byIds: Record<string, Milk>;
};
