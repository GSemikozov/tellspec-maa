export const SENSOR_DISCONNECTED = 'Sensor connection lost.';

export const isSensorDisconnectedError = (error: any) =>
    error?.message === 'Sensor disconnected' || error?.message === SENSOR_DISCONNECTED;
