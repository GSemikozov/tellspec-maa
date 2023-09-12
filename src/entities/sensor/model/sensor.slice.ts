import { createSlice } from '@reduxjs/toolkit';

import { CalibrationStatus } from './sensor.types';
import { calibrateDevice, removeDevice } from './sensor.actions';

import type { SensorState, SetDeviceAction } from './sensor.types';

const initialState: SensorState = {
    calibrationStatus: CalibrationStatus.DISCONNECTED,
    device: null,
    scannerActive: false,
    sensorModel: '',
    enSensorEmulation: true,
    calibrationRequired: true,
    entities: {},
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

        builder.addCase(calibrateDevice.rejected, (state, action) => {
            state.calibrationStatus = CalibrationStatus.ERROR;

            console.log('[calibrateDevice.rejected]', JSON.stringify(action));
        });

        builder.addCase(calibrateDevice.fulfilled, (state, action) => {
            state.calibrationStatus = CalibrationStatus.READY;

            if (!action.payload) {
                return;
            }

            state.device = action.payload.updatedDevice;
        });

        builder.addCase(removeDevice.fulfilled, state => {
            state.device = null;
            state.calibrationStatus = CalibrationStatus.DISCONNECTED;
        });
    },
});

export const sensorActions = sensorSlice.actions;

export const sensorReducer = sensorSlice.reducer;
