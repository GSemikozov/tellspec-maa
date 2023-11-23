import { tellspecRetrieveDeviceConnect, tellspecGetSensorStatus } from '@api/native';

import { SensorDisconnectedError } from './errors';

export const SENSOR_DISCONNECTED = 'Sensor connection lost.';

export const resolveSensorDisconnectedError = (error: any) =>
    error?.message === 'Sensor disconnected' || error?.message === SENSOR_DISCONNECTED;

export const withSensorHealthcheck = async <T>(
    deviceUuid: string,
    executor?: () => Promise<T>,
): Promise<T | null> => {
    try {
        await tellspecRetrieveDeviceConnect(deviceUuid);

        let result: T | null = null;
        if (executor) {
            result = await executor();
        }

        await tellspecGetSensorStatus();

        return result;
    } catch (error: unknown) {
        if (resolveSensorDisconnectedError(error)) {
            throw new SensorDisconnectedError();
        }

        throw error;
    }
};
