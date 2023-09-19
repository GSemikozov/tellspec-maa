import { TellspecSensorDevice } from '@api/native';

export enum CalibrationStatus {
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
    REQUIRED = 'required',
    PROGRESS = 'progress',
    READY = 'ready',
}

export type SensorDevice = TellspecSensorDevice & {
    batteryLevel?: number;
};

export type SensorState = {
    calibrationStatus: CalibrationStatus;
    currentDevice: SensorDevice | null;
    pairedDevices: SensorDevice[];

    scannerActive: boolean;
    sensorModel: string;
    enSensorEmulation: boolean;
    calibrationRequired: boolean;

    sensorScanning: {
        status: 'idle' | 'progress';
    };
};
