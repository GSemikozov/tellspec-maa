import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app';

import { CalibrationStatus } from './sensor.types';

export const selectSensorState = (state: RootState) => state.sensor;

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

export const getScanById = (id: string) => (state: RootState) => {
    return state.sensor.entities[id];
};
