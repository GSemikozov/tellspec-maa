import { TellspecSensorDevice } from '@api/native';

export enum CalibrationStatus {
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
    REQUIRED = 'required',
    PROGRESS = 'progress',
    READY = 'ready',
}

export type SensorDevice = TellspecSensorDevice;

export type SensorState = {
    calibrationStatus: CalibrationStatus;
    device: SensorDevice | null;
    scannerActive: boolean;
    sensorModel: string;
    enSensorEmulation: boolean;
    calibrationRequired: boolean;
    entities: any; // TODO. Add type for scans
};
