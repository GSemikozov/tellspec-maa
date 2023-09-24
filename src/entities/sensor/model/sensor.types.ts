import { TellspecSensorDevice } from '@api/native';

import { GetCalibrationResponse, GetSensorScannerResponse } from '../api';

export enum CalibrationStatus {
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
    REQUIRED = 'required',
    PROGRESS = 'progress',
    READY = 'ready',
}

export type SensorDevice = TellspecSensorDevice & {
    batteryLevel?: number;
    humidity?: number;
    temperature?: number;
    lampTime?: string;
};

export type Calibration = GetCalibrationResponse;
export type SensorScannerData = GetSensorScannerResponse;

export type SensorState = {
    calibrationStatus: CalibrationStatus;
    currentDevice: SensorDevice | null;
    pairedDevices: SensorDevice[];
    lastCalibration: Calibration | null;
    sensorScannerData: SensorScannerData | null;

    calibrationRequired: boolean;

    sensorScanning: {
        status: 'idle' | 'progress';
    };
};
