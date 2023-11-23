import { createSlice } from '@reduxjs/toolkit';

import { isSensorDisconnectedError } from '../errors';

import { CalibrationStatus } from './sensor.types';
import {
    connectSensorDevice,
    calibrateSensorDevice,
    removeDevice,
    runSensorScan,
    getSensorStatus,
    getSensorScanner,
    saveActiveCalibrationSensor,
    warmupSensorDevice,
    getSensorCalibration,
} from './sensor.actions';

import type { SensorState, SetSensorStatusAction } from './sensor.types';

const initialState: SensorState = {
    currentDevice: null,
    calibrationStatus: CalibrationStatus.DISCONNECTED,
    calibrationRequired: false,

    sensorScannerData: null,
    pairedDevices: [],

    sensorScanning: {
        status: 'idle',
    },
    saveCalibrationStatus: 'idle',
    warmupSensorStatus: 'idle',

    serverSensorCalibration: {
        data: null,
        status: 'idle',
    },
};

const isSensorRejectedWithDisconnectedError = (payload: unknown) => {
    console.log('isSensoRejectedWithDisconnectedError:start', JSON.stringify(payload));

    const result =
        typeof payload === 'object' &&
        payload !== null &&
        'error' in payload &&
        isSensorDisconnectedError(payload.error);

    console.log('isSensoRejectedWithDisconnectedError:result', result);

    return result;
};

export const sensorSlice = createSlice({
    name: 'sensor',
    initialState,
    reducers: {
        cancelWarmup: state => {
            state.warmupSensorStatus = 'idle';
        },

        acceptSensorCalibration: state => {
            state.calibrationStatus = CalibrationStatus.READY;
        },

        setSensorStatus: (state, action: SetSensorStatusAction) => {
            const currentDevice = state.currentDevice;

            if (!currentDevice) {
                return;
            }

            const { temperature, humidity, battery, lampTime } = action.payload;

            state.currentDevice = {
                ...currentDevice,
                batteryLevel: Number(battery),
                humidity,
                temperature,
                lampTime,
                lastInteractionAt: +new Date(),
            };
        },
    },

    extraReducers: builder => {
        // get server calibration
        builder.addCase(getSensorCalibration.pending, state => {
            state.serverSensorCalibration.status = 'progress';
        });
        builder.addCase(getSensorCalibration.fulfilled, (state, action) => {
            state.serverSensorCalibration.status = 'idle';

            if (!action.payload) {
                return state;
            }

            state.serverSensorCalibration.data = action.payload;
        });
        builder.addCase(getSensorCalibration.rejected, state => {
            state.serverSensorCalibration.data = null;
            state.serverSensorCalibration.status = 'idle';
        });

        // warmup sensor
        builder.addCase(warmupSensorDevice.pending, state => {
            if (!state.currentDevice) {
                return state;
            }

            state.warmupSensorStatus = 'progress';
            state.currentDevice.lastInteractionAt = +new Date();
        });
        builder.addCase(warmupSensorDevice.fulfilled, state => {
            state.warmupSensorStatus = 'idle';
        });
        builder.addCase(warmupSensorDevice.rejected, state => {
            state.warmupSensorStatus = 'idle';
        });

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
                batteryLevel: Number(action.payload.battery),
                humidity: action.payload.humidity,
                temperature: action.payload.temperature,
                lampTime: action.payload.lampTime,
                lastInteractionAt: +new Date(),
            };
        });
        builder.addCase(getSensorStatus.rejected, (state, action) => {
            if (isSensorRejectedWithDisconnectedError(action.payload)) {
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
            if (!action.payload) {
                return;
            }

            const { device, requiredCalibration } = action.payload;

            const updatedDevice = {
                ...(state.currentDevice ?? {}),
                ...device,
                lastInteractionAt: +new Date(),
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
            if (isSensorRejectedWithDisconnectedError(action.payload)) {
                state.currentDevice = null;
            }
        });

        // calibrate sensor device
        builder.addCase(calibrateSensorDevice.pending, state => {
            state.calibrationStatus = CalibrationStatus.PROGRESS;
        });
        builder.addCase(calibrateSensorDevice.fulfilled, (state, action) => {
            state.calibrationStatus = CalibrationStatus.NEED_ACCEPT;

            if (!action.payload) {
                return;
            }

            const { updatedDevice: device } = action.payload;

            const updatedDevice = {
                ...(state.currentDevice ?? {}),
                ...device,
                lastInteractionAt: +new Date(),
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

            if (isSensorRejectedWithDisconnectedError(action.payload)) {
                state.currentDevice = null;
            }
        });

        // sensor scanning
        builder.addCase(runSensorScan.pending, state => {
            if (!state.currentDevice) {
                return state;
            }

            state.sensorScanning.status = 'progress';
            state.currentDevice.lastInteractionAt = +new Date();
        });
        builder.addCase(runSensorScan.fulfilled, state => {
            state.sensorScanning.status = 'idle';
        });
        builder.addCase(runSensorScan.rejected, (state, action) => {
            state.sensorScanning.status = 'idle';

            if (isSensorRejectedWithDisconnectedError(action.payload)) {
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
