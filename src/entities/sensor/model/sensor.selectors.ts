import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app';

import { CalibrationStatus } from './sensor.types';

export const selectSensorState = (state: RootState) => state.sensor;
export const selectSensorScanningState = createSelector(
    [selectSensorState],
    sensorState => sensorState.sensorScanning,
);

export const selectSensorCalibrationStatus = createSelector(
    [selectSensorState],
    sensorState => sensorState.calibrationStatus,
);

export const selectSensorCalibrationDisconnected = createSelector(
    [selectSensorCalibrationStatus],
    calibrationStatus => [CalibrationStatus.DISCONNECTED].includes(calibrationStatus),
);

export const selectSensorCalibrationRequired = createSelector(
    [selectSensorCalibrationStatus],
    calibrationStatus =>
        [CalibrationStatus.ERROR, CalibrationStatus.REQUIRED].includes(calibrationStatus),
);

export const selectSensorCalibrationLoading = createSelector(
    [selectSensorCalibrationStatus],
    calibrationStatus => [CalibrationStatus.PROGRESS].includes(calibrationStatus),
);

export const selectSensorCalibrationReady = createSelector(
    [selectSensorCalibrationStatus],
    calibrationStatus => [CalibrationStatus.READY].includes(calibrationStatus),
);

export const selectSensorCalibration = createSelector(
    [selectSensorState],
    sensorState => sensorState.lastCalibration,
);

export const selectSensorScannerData = createSelector(
    [selectSensorState],
    sensorState => sensorState.sensorScannerData,
);

export const selectSensorDevice = createSelector(
    [selectSensorState],
    sensorState => sensorState.currentDevice,
);

export const selectSensorDeviceBatteryLevel = createSelector(
    [selectSensorDevice],
    sensorDevice => sensorDevice?.batteryLevel ?? 100,
);

export const selectSensorPairedDevices = createSelector(
    [selectSensorState],
    sensorState => sensorState.pairedDevices,
);

export const selectIsSensorScanning = createSelector(
    [selectSensorScanningState],
    sensorScanningState => sensorScanningState.status === 'progress',
);
