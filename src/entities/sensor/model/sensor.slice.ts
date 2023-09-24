import { createSlice } from '@reduxjs/toolkit';

import { CalibrationStatus } from './sensor.types';
import {
    connectSensorDevice,
    calibrateSensorDevice,
    removeDevice,
    runSensorScan,
    getSensorStatus,
    getSensorCalibration,
    getSensorScanner,
} from './sensor.actions';

import type { SensorState } from './sensor.types';

const initialState: SensorState = {
    calibrationStatus: CalibrationStatus.DISCONNECTED,
    calibrationRequired: false,
    currentDevice: null,
    lastCalibration: null,
    sensorScannerData: null,
    pairedDevices: [],

    sensorScanning: {
        status: 'idle',
    },
};

export const sensorSlice = createSlice({
    name: 'sensor',
    initialState,
    reducers: {},

    extraReducers: builder => {
        // update sensor status
        builder.addCase(getSensorStatus.fulfilled, (state, action) => {
            const currentDevice = state.currentDevice;

            if (!currentDevice) {
                return;
            }

            state.currentDevice = {
                ...currentDevice,
                batteryLevel: action.payload.battery,
                humidity: action.payload.humidity,
                temperature: action.payload.temperature,
                lampTime: action.payload.lampTime,
            };
        });

        // get sensor calibration
        builder.addCase(getSensorCalibration.fulfilled, (state, action) => {
            if (!action.payload) {
                return;
            }

            state.lastCalibration = action.payload;
        });

        // get sensor scanner
        builder.addCase(getSensorScanner.fulfilled, (state, action) => {
            if (!action.payload) {
                return;
            }

            state.sensorScannerData = action.payload;
        });

        // connect sensor device
        builder.addCase(connectSensorDevice.fulfilled, (state, action) => {
            const { device, requiredCalibration } = action.payload;

            const updatedDevice = {
                ...(state.currentDevice ?? {}),
                ...device,
            };

            state.currentDevice = updatedDevice;
            state.calibrationStatus = requiredCalibration
                ? CalibrationStatus.REQUIRED
                : CalibrationStatus.READY;

            const foundPairedDevice = state.pairedDevices.find(
                pairedDevice => pairedDevice.uuid === updatedDevice.uuid,
            );

            if (foundPairedDevice) {
                return;
            }

            state.pairedDevices = [updatedDevice];
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

            const { updatedDevice: device } = action.payload;

            const updatedDevice = {
                ...(state.currentDevice ?? {}),
                ...device,
            };

            state.currentDevice = updatedDevice;

            const foundPairedDeviceIdx = state.pairedDevices.findIndex(
                pairedDevice => pairedDevice.uuid === updatedDevice.uuid,
            );

            if (foundPairedDeviceIdx > -1) {
                state.pairedDevices = [
                    ...state.pairedDevices.slice(0, foundPairedDeviceIdx),
                    updatedDevice,
                    ...state.pairedDevices.slice(foundPairedDeviceIdx + 1),
                ];
            } else {
                state.pairedDevices = [updatedDevice];
            }
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
        builder.addCase(removeDevice.fulfilled, (state, action) => {
            const { removedUuid, removedCurrent } = action.payload;

            const currentDevice = state.currentDevice;

            if (removedCurrent && currentDevice) {
                if (currentDevice) {
                    const foundPairedDeviceIdx = state.pairedDevices.findIndex(
                        pairedDevice => pairedDevice.uuid === currentDevice.uuid,
                    );

                    if (foundPairedDeviceIdx > -1) {
                        state.pairedDevices = state.pairedDevices.filter(
                            pairedDevice => pairedDevice.uuid !== currentDevice.uuid,
                        );
                    }
                }

                state.currentDevice = null;
                state.calibrationStatus = CalibrationStatus.DISCONNECTED;
            } else {
                state.pairedDevices = state.pairedDevices.filter(
                    pairedDevice => pairedDevice.uuid !== removedUuid,
                );
            }
        });
    },
});

export const sensorActions = sensorSlice.actions;

export const sensorReducer = sensorSlice.reducer;
