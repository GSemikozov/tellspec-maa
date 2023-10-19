import { createSlice } from '@reduxjs/toolkit';

import { SENSOR_DISCONNECTED } from '../helpers';

import { CalibrationStatus } from './sensor.types';
import {
    connectSensorDevice,
    calibrateSensorDevice,
    removeDevice,
    runSensorScan,
    getSensorStatus,
    getSensorScanner,
    saveActiveCalibrationSensor,
} from './sensor.actions';

import type { SensorState } from './sensor.types';

const initialState: SensorState = {
    calibrationStatus: CalibrationStatus.DISCONNECTED,
    calibrationRequired: false,
    currentDevice: null,
    sensorScannerData: null,
    pairedDevices: [],

    sensorScanning: {
        status: 'idle',
    },

    saveCalibrationStatus: 'idle',
};

export const sensorSlice = createSlice({
    name: 'sensor',
    initialState,
    reducers: {},

    extraReducers: builder => {
        // update save active calibration status
        builder.addCase(saveActiveCalibrationSensor.pending, state => {
            state.saveCalibrationStatus = 'progress';
        });
        builder.addCase(saveActiveCalibrationSensor.fulfilled, state => {
            state.saveCalibrationStatus = 'idle';
        });
        builder.addCase(saveActiveCalibrationSensor.rejected, state => {
            state.saveCalibrationStatus = 'idle';
        });

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
        builder.addCase(getSensorStatus.rejected, (state, action) => {
            if (action.payload === SENSOR_DISCONNECTED) {
                state.currentDevice = null;
            }
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
        builder.addCase(connectSensorDevice.rejected, (state, action) => {
            if (action.payload === SENSOR_DISCONNECTED) {
                state.currentDevice = null;
            }
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
            console.log('[calibrateDevice.rejected]', JSON.stringify(action));

            state.calibrationStatus = CalibrationStatus.ERROR;

            if (action.payload === SENSOR_DISCONNECTED) {
                state.currentDevice = null;
            }
        });

        // sensor scanning
        builder.addCase(runSensorScan.pending, state => {
            state.sensorScanning.status = 'progress';
        });
        builder.addCase(runSensorScan.fulfilled, state => {
            state.sensorScanning.status = 'idle';
        });
        builder.addCase(runSensorScan.rejected, (state, action) => {
            state.sensorScanning.status = 'idle';

            if (action.payload === SENSOR_DISCONNECTED) {
                state.currentDevice = null;
            }
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
