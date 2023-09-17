import { createAsyncThunk } from '@reduxjs/toolkit';

import {
    NativeStorageKeys,
    isEmulateNativeSdk,
    nativeStore,
    tellspecConnect,
    tellspecGetConfigs,
    tellspecGetDeviceInfo,
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
    if (!sensor.device) {
        return;
    }

    const scanCalibrationData = tellspecPrepareScanCalibration({
        sensorScannedData,
        model: sensor.device.name,
        activeConfigName: preferConfig,
        userEmail: user.email,
    });

    const requestCalibration: SetCalibrationRequest = {
        model: sensor.device.name,
        serial_number: sensor.device.serial,
        white_reference: scanCalibrationData,
    };

    await apiInstance.sensor.setCalibration(requestCalibration);

    const toNativeStore = {
        model: sensor.device.name,
        serial_number: sensor.device.serial,
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
    async (device: TellspecSensorDevice, { rejectWithValue }) => {
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

            return rejectWithValue(errorMessage);
        }
    },
);

export const calibrateSensorDevice = createAsyncThunk('sensor/calibrate', async (_, thunkAPI) => {
    const { user, sensor } = thunkAPI.getState() as RootState;

    if (!sensor.device) {
        return;
    }

    // get the ScannerData
    const scannerData = await apiInstance.sensor.getScanner(
        sensor.device.name,
        sensor.device.serial,
    );

    if (!scannerData) {
        return;
    }

    await tellspecConnect({ address: sensor.device.uuid });
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

    const updatedDevice = { ...sensor.device };

    updatedDevice.activeCal = result;
    updatedDevice.activeConfig = result.config;

    await tellspecSavePairDevice(updatedDevice);

    return {
        calibrationData: result,
        updatedDevice,
    };
});

export const removeDevice = createAsyncThunk('sensor/removeDevice', async () => {
    await tellspecRemoveDevice();
});

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

export const runSensorScan = createAsyncThunk('sensor/runScan', async (userEmail: string) => {
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
    } catch (error) {
        console.error(error);
        throw new Error("Can't run sensor scanning. Try again later");
    }
});
