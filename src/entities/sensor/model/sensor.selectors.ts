import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app';

export const selectSensorState = (state: RootState) => state.sensor;

export const selectSensorCalibrationStatus = createSelector(
    [selectSensorState],
    sensorState => sensorState.calibrationStatus,
);
