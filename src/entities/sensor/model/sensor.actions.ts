import { createAsyncThunk } from '@reduxjs/toolkit';

import {
    NativeStorageKeys,
    nativeStore,
    tellspecCleanScanData,
    tellspecConnect,
    tellspecGetConfigs,
    tellspecPrepareScanCalibration,
    tellspecReadScannerInfo,
    tellspecRemoveDevice,
    tellspecSavePairDevice,
    tellspecSetActiveConfig,
    tellspecStartScan,
} from '@api/native';
import { apiInstance } from '@api/network';

import type { RootState } from '@app/store';
import type { TellspecSensorDevice } from '@api/native';
import type { SensorCalibrationPostType } from './sensor.types';

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

export const calibrateDevice = createAsyncThunk('sensor/calibrate', async (_, thunkAPI) => {
    const { user, sensor } = thunkAPI.getState() as RootState;

    if (!sensor.device) {
        return;
    }

    const saveCalibration = async (preferConfig: any, scan: any) => {
        if (!sensor.device) {
            return;
        }

        const requestCalibration: SensorCalibrationPostType = {
            model: sensor.device.name,
            serial_number: sensor.device.serial,
            white_reference: tellspecPrepareScanCalibration(
                scan,
                sensor.device.name,
                preferConfig,
                '',
                user.email,
            ),
        };

        await apiInstance.sensor.setCalibration(requestCalibration);

        const toNativeStore = {
            model: sensor.device.name,
            serial_number: sensor.device.serial,
            config: preferConfig,
            scan: tellspecPrepareScanCalibration(
                scan,
                sensor.device.name,
                preferConfig,
                '',
                user.email,
            ),
        };

        console.log('[calibrateDevice]: saveCalibration', toNativeStore);
        await nativeStore.set(NativeStorageKeys.DEVICE_CALIBRATION, toNativeStore);

        return toNativeStore;
    };

    // get the ScannerData
    const scannerData = await apiInstance.sensor.getScanner(
        sensor.device.name,
        sensor.device.serial,
    );

    await tellspecConnect({ address: sensor.device.uuid });
    await tellspecReadScannerInfo();

    // start by getting the sensor scan
    const scanData = tellspecCleanScanData(await tellspecStartScan());
    const configs = await tellspecGetConfigs();

    let result: any | null = null;

    for (let index = 0; index < scannerData.try_configs.length; index++) {
        const preferConfig = scannerData.try_configs[index];

        if (preferConfig === configs.activeConfig) {
            // the config is already active.
            result = await saveCalibration(preferConfig, scanData);

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
                    await tellspecSetActiveConfig(preferConfig);

                    result = await saveCalibration(preferConfig, scanData);

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

export const removeDevice = createAsyncThunk('sensor/remove-device', async () => {
    await tellspecRemoveDevice();
});
