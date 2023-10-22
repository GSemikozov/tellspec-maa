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
        [
            CalibrationStatus.ERROR,
            CalibrationStatus.REQUIRED,
            CalibrationStatus.NEED_ACCEPT,
        ].includes(calibrationStatus),
);

export const selectSensorCalibrationLoading = createSelector(
    [selectSensorCalibrationStatus],
    calibrationStatus => [CalibrationStatus.PROGRESS].includes(calibrationStatus),
);

export const selectSensorCalibrationReady = createSelector(
    [selectSensorCalibrationStatus],
    calibrationStatus => [CalibrationStatus.READY].includes(calibrationStatus),
);

export const selectSensorScannerData = createSelector(
    [selectSensorState],
    sensorState => sensorState.sensorScannerData,
);

export const selectSensorDevice = createSelector(
    [selectSensorState],
    sensorState => sensorState.currentDevice,
);

export const selectSensorDeviceActiveCalibration = createSelector(
    [selectSensorState],
    sensorState => sensorState.currentDevice?.activeCal,
);

export const selectSensorDeviceBatteryLevel = createSelector(
    [selectSensorDevice],
    sensorDevice => sensorDevice?.batteryLevel ?? 100,
);

export const selectSensorDeviceTemperature = createSelector(
    [selectSensorDevice],
    sensorDevice => sensorDevice?.temperature ?? 0,
);

export const selectSensorDeviceHumidity = createSelector(
    [selectSensorDevice],
    sensorDevice => sensorDevice?.humidity ?? 0,
);

export const selectSensorPairedDevices = createSelector(
    [selectSensorState],
    sensorState => sensorState.pairedDevices,
);

export const selectIsSensorScanning = createSelector(
    [selectSensorScanningState],
    sensorScanningState => sensorScanningState.status === 'progress',
);

export const selectIsActiveCalibrationSaveLoading = createSelector(
    [selectSensorState],
    sensorState => sensorState.saveCalibrationStatus === 'progress',
);

export const selectIsWarmupSensorLoading = createSelector(
    [selectSensorState],
    sensorState => sensorState.warmupSensorStatus === 'progress',
);

export const selectServerSensorCalibartion = createSelector(
    [selectSensorState],
    sensorState => sensorState.serverSensorCalibration,
);

export const selectServerSensorCalibartionData = createSelector(
    [selectServerSensorCalibartion],
    serverSensorCalibration => serverSensorCalibration.data,
);
