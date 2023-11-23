import { tellspecRetrieveDeviceConnect } from '@api/native';

import { SensorDisconnectedError } from './errors';

export const SENSOR_DISCONNECTED = 'Sensor connection lost.';

export const resolveSensorDisconnectedError = (error: any) =>
    error?.message === 'Sensor disconnected' || error?.message === SENSOR_DISCONNECTED;

export const withSensorHealthcheck = async <T>(
    deviceUuid: string,
    executor: () => Promise<T>,
): Promise<T> => {
    try {
        await tellspecRetrieveDeviceConnect(deviceUuid);

        const result = await executor();

        // await tellspecGetSensorStatus();

        return result;
    } catch (error: unknown) {
        console.log('withSensorHealthcheck:error', JSON.stringify(error));

        if (resolveSensorDisconnectedError(error)) {
            throw new SensorDisconnectedError();
        }

        throw error;
    }
};
