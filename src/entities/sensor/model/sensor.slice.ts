import { createSlice } from '@reduxjs/toolkit';

import { CalibrationStatus } from './sensor.types';
import {
    connectSensorDevice,
    calibrateSensorDevice,
    removeDevice,
    runSensorScan,
} from './sensor.actions';

import type { SensorState } from './sensor.types';

const initialState: SensorState = {
    calibrationStatus: CalibrationStatus.DISCONNECTED,
    calibrationRequired: false,
    device: null,

    scannerActive: false,
    sensorModel: '',
    enSensorEmulation: true,

    sensorScanning: {
        status: 'idle',
    },
};

export const sensorSlice = createSlice({
    name: 'sensor',
    initialState,
    reducers: {},

    extraReducers: builder => {
        // connect sensor device
        builder.addCase(connectSensorDevice.fulfilled, (state, action) => {
            const { device, requiredCalibration } = action.payload;

            state.device = device;

            state.calibrationStatus = requiredCalibration
                ? CalibrationStatus.REQUIRED
                : CalibrationStatus.READY;
        });

        // calibrate sensor device
        builder.addCase(calibrateSensorDevice.pending, state => {
            state.calibrationStatus = CalibrationStatus.PROGRESS;
        });
        builder.addCase(calibrateSensorDevice.fulfilled, (state, action) => {
            state.calibrationStatus = CalibrationStatus.READY;

            if (!action.payload) {
                return;
            }

            state.device = action.payload.updatedDevice;
        });
        builder.addCase(calibrateSensorDevice.rejected, (state, action) => {
            state.calibrationStatus = CalibrationStatus.ERROR;

            console.log('[calibrateDevice.rejected]', JSON.stringify(action));
        });

        // sensor scanning
        builder.addCase(runSensorScan.pending, state => {
            state.sensorScanning.status = 'progress';
        });
        builder.addCase(runSensorScan.fulfilled, state => {
            state.sensorScanning.status = 'idle';
        });
        builder.addCase(runSensorScan.rejected, state => {
            state.sensorScanning.status = 'idle';
        });

        // remove device
        builder.addCase(removeDevice.fulfilled, state => {
            state.device = null;
            state.calibrationStatus = CalibrationStatus.DISCONNECTED;
        });
    },
});

export const sensorActions = sensorSlice.actions;

export const sensorReducer = sensorSlice.reducer;
