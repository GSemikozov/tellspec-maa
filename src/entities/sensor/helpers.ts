export const SENSOR_DISCONNECTED = 'sensor_disconnected';

export const isSensorDisconnectedError = (error: any) =>
    error?.message === 'Sensor disconnected' || error?.message === SENSOR_DISCONNECTED;
