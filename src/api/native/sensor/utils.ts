import type { TellspecSensorBaseResponseFail } from './types';

export const createTellspecErrorResponse = (message: string): TellspecSensorBaseResponseFail => ({
    status: 'error',
    message,
});
