import { TellspecSensorDevice } from '@api/native';

import { GetScanDataItem } from '../api';

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

    sensorScanning: {
        status: 'idle' | 'progress';
    };

    scan: {
        status: 'idle' | 'loading' | 'success' | 'error';
        byIds: Record<string, GetScanDataItem>;
    };
};
