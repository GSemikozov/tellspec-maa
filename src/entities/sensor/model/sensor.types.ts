import { TellspecSensorDevice } from '@api/native';

import { GetCalibrationResponse, GetSensorScannerResponse } from '../api';

export enum CalibrationStatus {
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
    REQUIRED = 'required',
    PROGRESS = 'progress',
    NEED_ACCEPT = 'need_accept',
    READY = 'ready',
}

export type Calibration = {
    model: string;
    serial_number: string;
    config: string;
    scan: GetCalibrationResponse['scan'];
};

export type SensorDevice = Omit<TellspecSensorDevice, 'activeCal'> & {
    batteryLevel?: number;
    humidity?: number;
    temperature?: number;
    lampTime?: string;
    activeCal?: Calibration;
    lastInteractionAt?: number;
};

export type SensorScannerData = GetSensorScannerResponse;

export type SensorState = {
    calibrationStatus: CalibrationStatus;
    currentDevice: SensorDevice | null;
    pairedDevices: SensorDevice[];
    sensorScannerData: SensorScannerData | null;

    calibrationRequired: boolean;

    sensorScanning: {
        status: 'idle' | 'progress';
    };

    saveCalibrationStatus: 'idle' | 'progress';
    warmupSensorStatus: 'idle' | 'progress';

    serverSensorCalibration: {
        data: GetCalibrationResponse | null;
        status: 'idle' | 'progress';
    };
};
