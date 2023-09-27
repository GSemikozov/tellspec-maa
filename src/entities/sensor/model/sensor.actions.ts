import { createAsyncThunk } from '@reduxjs/toolkit';

import {
    NativeStorageKeys,
    isEmulateNativeSdk,
    nativeStore,
    tellspecConnect,
    tellspecGetConfigs,
    tellspecGetDeviceInfo,
    tellspecGetSensorStatus,
    tellspecPrepareScanCalibration,
    tellspecPrepareSensorScannedData,
    tellspecReadScannerInfo,
    tellspecRemoveDevice,
    tellspecRunScan,
    tellspecSavePairDevice,
    tellspecSetActiveConfig,
    tellspecStartScan,
} from '@api/native';
import { apiInstance } from '@api/network';

import { EMULATION_SCAN_ID } from '../sensor.constants';
import { prepareSpectrumScanData, type SetCalibrationRequest } from '../api';

import type { RootState } from '@app/store';
import type { TellspecSensorDevice, TellspecSensorScannedData } from '@api/native';

// TODO: move to service
type saveCalibrationOptions = {
    user: RootState['user'];
    sensor: RootState['sensor'];
    preferConfig: string;
    sensorScannedData: TellspecSensorScannedData;
};

const saveCalibration = async ({
    sensor,
    user,
    preferConfig,
    sensorScannedData,
}: saveCalibrationOptions) => {
    if (!sensor.currentDevice) {
        return;
    }

    const scanCalibrationData = tellspecPrepareScanCalibration({
        sensorScannedData,
        model: sensor.currentDevice.name,
        activeConfigName: preferConfig,
        userEmail: user.email,
    });

    const requestCalibration: SetCalibrationRequest = {
        model: sensor.currentDevice.name,
        serial_number: sensor.currentDevice.serial,
        white_reference: scanCalibrationData,
    };

    await apiInstance.sensor.setCalibration(requestCalibration);

    const toNativeStore = {
        model: sensor.currentDevice.name,
        serial_number: sensor.currentDevice.serial,
        config: preferConfig,
        scan: scanCalibrationData,
    };

    console.log('[calibrateDevice/saveCalibration]: toNativeStore', toNativeStore);
    await nativeStore.set(NativeStorageKeys.DEVICE_CALIBRATION, toNativeStore);

    return toNativeStore;
};

export const getPairDevice = createAsyncThunk(
    'sensor/connect',
    async (): Promise<TellspecSensorDevice> => {
        const device = await nativeStore.get(NativeStorageKeys.DEVICE);

        if (!device) {
            throw new Error('No device found');
        }

        return device;
    },
);

export const connectSensorDevice = createAsyncThunk(
    'sensor/connect',
    async (device: TellspecSensorDevice, thunkAPI) => {
        const { sensor } = thunkAPI.getState() as RootState;

        try {
            const shallowDevice = { ...device };
            const calibrationData = await tellspecGetDeviceInfo(shallowDevice);
            const calibrationReady = Boolean(calibrationData);

            if (calibrationReady) {
                shallowDevice.activeCal = calibrationData;
                shallowDevice.activeConfig = calibrationData.config;
            }

            await tellspecSavePairDevice(shallowDevice);

            return {
                device: shallowDevice,
                requiredCalibration: !calibrationReady,
            };
        } catch (error: any) {
            console.error('[connectDevice]: ', error);
            const errorMessage = error.message ?? 'Unabled to pair with sensor';

            if (sensor.currentDevice) {
                thunkAPI.dispatch(removeDevice(sensor.currentDevice.uuid));
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    },
);

export const getSensorCalibration = createAsyncThunk(
    'sensor/getCalibration',
    async (_, thunkAPI) => {
        const { sensor } = thunkAPI.getState() as RootState;

        if (!sensor.currentDevice || !sensor.currentDevice.activeConfig) {
            return;
        }

        const calibrationData = await apiInstance.sensor.getCalibration(
            sensor.currentDevice.name,
            sensor.currentDevice.serial,
            sensor.currentDevice.activeConfig,
        );

        return calibrationData;
    },
);

export const calibrateSensorDevice = createAsyncThunk('sensor/calibrate', async (_, thunkAPI) => {
    const { user, sensor } = thunkAPI.getState() as RootState;

    if (!sensor.currentDevice) {
        return;
    }

    try {
        // get the ScannerData
        const scannerData = await apiInstance.sensor.getScanner(
            sensor.currentDevice.name,
            sensor.currentDevice.serial,
        );

        if (!scannerData) {
            return;
        }

        await tellspecConnect({ address: sensor.currentDevice.uuid });
        await tellspecReadScannerInfo();

        // start by getting the sensor scan
        const sensorScannedData = tellspecPrepareSensorScannedData(await tellspecStartScan());
        const configs = await tellspecGetConfigs();

        let result: any | null = null;

        for (let index = 0; index < scannerData.try_configs.length; index++) {
            const preferConfig = scannerData.try_configs[index];

            if (preferConfig === configs.activeConfig) {
                // the config is already active.
                result = await saveCalibration({
                    user,
                    sensor,
                    preferConfig,
                    sensorScannedData,
                });

                return;
            } else {
                // check if it matches one of our configs
                for (
                    let configIndex = 0;
                    configIndex < configs.configsAvailable.length;
                    configIndex++
                ) {
                    const avaliableConfig = configs.configsAvailable[configIndex];

                    if (avaliableConfig === preferConfig) {
                        // we found a config that we can use. Its not active, se we need to set the device accordantly
                        await tellspecSetActiveConfig({ name: preferConfig });

                        result = await saveCalibration({
                            user,
                            sensor,
                            preferConfig,
                            sensorScannedData,
                        });

                        return;
                    }
                }
            }
        }

        if (!result) {
            throw new Error("Sensor doesn't a valid config.");
        }

        const updatedDevice = { ...sensor.currentDevice };

        updatedDevice.activeCal = result;
        updatedDevice.activeConfig = result.config;

        await tellspecSavePairDevice(updatedDevice);

        return {
            calibrationData: result,
            updatedDevice,
        };
    } catch (error: any) {
        if (error.message === 'Sensor disconnected') {
            thunkAPI.dispatch(removeDevice(sensor.currentDevice.uuid));
        }

        throw error;
    }
});

export const removeDevice = createAsyncThunk(
    'sensor/removeDevice',
    async (deviceUuid: string, thunkAPI) => {
        const { sensor } = thunkAPI.getState() as RootState;

        let removedCurrent = false;

        if (sensor.currentDevice?.uuid === deviceUuid) {
            await tellspecRemoveDevice();

            removedCurrent = true;
        }

        return { removedUuid: deviceUuid, removedCurrent };
    },
);

export const saveScan = createAsyncThunk(
    'sensor/saveScanData',
    async (requestBody: TellspecSensorScannedData) => {
        try {
            const response = await apiInstance.sensor.saveScan(requestBody);

            if (response.data === null) {
                return null;
            }

            return response.data;
        } catch (error) {
            console.error(error);

            throw new Error("Can't save scan. Try again later");
        }
    },
);

export const runSensorScan = createAsyncThunk(
    'sensor/runScan',
    async (userEmail: string, thunkAPI) => {
        const { sensor } = thunkAPI.getState() as RootState;

        try {
            if (await isEmulateNativeSdk()) {
                const response = await apiInstance.sensor.getScanData(EMULATION_SCAN_ID);

                if (response.data === null || response.data.length === 0) {
                    return null;
                }

                const [spectrumScanDataItem] = response.data;

                return prepareSpectrumScanData(spectrumScanDataItem);
            }

            return tellspecRunScan(userEmail);
        } catch (error: any) {
            console.error(error);

            if (error.message === 'Sensor disconnected') {
                if (sensor.currentDevice) {
                    thunkAPI.dispatch(removeDevice(sensor.currentDevice.uuid));
                }
            }

            throw new Error("Can't run sensor scanning. Try again later");
        }
    },
);

export const getSensorStatus = createAsyncThunk('sensor/getSensorStatus', async (_, thunkAPI) => {
    const { sensor } = thunkAPI.getState() as RootState;

    try {
        const sensorStatus = await tellspecGetSensorStatus();

        return sensorStatus;
    } catch (error) {
        console.error(error);

        if (sensor.currentDevice) {
            thunkAPI.dispatch(removeDevice(sensor.currentDevice.uuid));
        }

        throw new Error('Someting goes wrong on getting sensor status. Try again later');
    }
});

export const getSensorScanner = createAsyncThunk('sensor/getSensorScanner', async (_, thunkAPI) => {
    const { sensor } = thunkAPI.getState() as RootState;

    if (!sensor.currentDevice) {
        return;
    }

    const sensorScanner = await apiInstance.sensor.getScanner(
        sensor.currentDevice.name,
        sensor.currentDevice.serial,
    );

    return sensorScanner;
});
