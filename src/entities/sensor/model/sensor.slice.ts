import { createSlice } from '@reduxjs/toolkit';

import { SensorState, SetDeviceAction, CalibrationStatus } from './sensor.types';
import { calibrateDevice } from './sensor.actions';

const initialState: SensorState = {
    calibrationStatus: CalibrationStatus.DISCONNECTED,
    device: null,
};

export const sensorSlice = createSlice({
    name: 'sensor',
    initialState,
    reducers: {
        setSensorState: (state, action: SetDeviceAction) => {
            const { device, requiredCalibration } = action.payload;

            state.calibrationStatus = requiredCalibration
                ? CalibrationStatus.REQUIRED
                : CalibrationStatus.READY;

            state.device = device;
        },
    },

    extraReducers: builder => {
        builder.addCase(calibrateDevice.pending, state => {
            state.calibrationStatus = CalibrationStatus.PROGRESS;
        });

        builder.addCase(calibrateDevice.fulfilled, (state, action) => {
            state.calibrationStatus = CalibrationStatus.READY;

            if (!action.payload) {
                return;
            }

            state.device = action.payload.updatedDevice;
        });
    },
});

export const sensorActions = sensorSlice.actions;

export const sensorReducer = sensorSlice.reducer;
