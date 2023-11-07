import { createAsyncThunk } from '@reduxjs/toolkit';

import {
    NativeStorageKeys,
    isEmulateNativeSdk,
    nativeStore,
    tellspecGetConfigs,
    tellspecGetDeviceInfo,
    tellspecGetSensorStatus,
    tellspecPrepareScanCalibration,
    tellspecPrepareSensorScannedData,
    tellspecRemoveDevice,
    tellspecRetrieveDeviceConnect,
    tellspecRunScan,
    tellspecSetActiveConfig,
    tellspecStartScan,
} from '@api/native';
import { apiInstance } from '@api/network';
import { log, logForServer } from '@shared/utils';

import { EMULATION_SCAN_ID } from '../sensor.constants';
import { prepareSpectrumScanData, type SetCalibrationRequest } from '../api';
import { SENSOR_DISCONNECTED, isSensorDisconnectedError } from '../helpers';

import { SensorDevice } from './sensor.types';

import type { RootState } from '@app/store';
import type { TellspecSensorDevice, TellspecSensorScannedData } from '@api/native';

type getPreparedCalibrationOptions = {
    currentDevice: SensorDevice;
    preferConfig: string;
    sensorCalibrationData: any;
};

const getPreparedCalibration = ({
    currentDevice,
    preferConfig,
    sensorCalibrationData,
}: getPreparedCalibrationOptions) => {
    const result = {
        model: currentDevice.name,
        serial_number: currentDevice.serial,
        config: preferConfig,
        scan: sensorCalibrationData,
    };

    return result;
};

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

export const connectSensorDevice = createAsyncThunk(
    'sensor/connect',
    async (device: TellspecSensorDevice) => {
        try {
            const shallowDevice = { ...device };
            const calibrationData = await tellspecGetDeviceInfo(shallowDevice);
            const calibrationReady = Boolean(calibrationData);

            await log('sensor/connect:shallowDevice', shallowDevice);
            await log('sensor/connect:calibrationData', calibrationData);

            if (calibrationReady) {
                shallowDevice.activeCal = calibrationData;
                shallowDevice.activeConfig = calibrationData.config;
            }

            await log('sensor/connect:shallowDeviceResult', shallowDevice);

            const result = {
                device: shallowDevice,
                requiredCalibration: !calibrationReady,
            };

            await log('sensor/connect:result', result);
            return result;
        } catch (error: any) {
            await log('sensor/connect:error', error);

            if (isSensorDisconnectedError(error)) {
                throw new Error(SENSOR_DISCONNECTED);
            }

            throw error;
        }
    },
);

export const calibrateSensorDevice = createAsyncThunk('sensor/calibrate', async (_, thunkAPI) => {
    const { user, sensor } = thunkAPI.getState() as RootState;

    await log('sensor/calibrate:currentDevice', sensor.currentDevice);

    if (!sensor.currentDevice) {
        return;
    }

    try {
        await tellspecRetrieveDeviceConnect(sensor.currentDevice.uuid);

        // get the ScannerData
        const scannerData = await apiInstance.sensor.getScanner(
            sensor.currentDevice.name,
            sensor.currentDevice.serial,
        );

        await log('sensor/calibrate:scannerData', scannerData);

        if (!scannerData) {
            return;
        }

        // start by getting the sensor scan
        const sensorScannedData = await tellspecStartScan();
        await log('sensor/calibrate:sensorScannedData', sensorScannedData);

        const preparedSensorScannedData = tellspecPrepareSensorScannedData(sensorScannedData);
        await log('sensor/calibrate:preparedSensorScannedData', preparedSensorScannedData);

        const configs = await tellspecGetConfigs();

        let result: any | null = null;

        await log('sensor/calibrate:configs', configs);

        for (let index = 0; index < scannerData.try_configs.length; index++) {
            const preferConfig = scannerData.try_configs[index].toLowerCase();
            const activeConfig = configs.activeConfig.toLowerCase();

            await log('sensor/calibrate:preferConfig', preferConfig);
            await log('sensor/calibrate:activeConfig', activeConfig);

            if (preferConfig === configs.activeConfig.toLowerCase()) {
                // the config is already active.
                const preparedScanCalibrationData = tellspecPrepareScanCalibration({
                    userEmail: user.email,
                    model: sensor.currentDevice.name,
                    activeConfigName: preferConfig,
                    sensorScannedData: preparedSensorScannedData,
                });

                result = getPreparedCalibration({
                    currentDevice: sensor.currentDevice,
                    preferConfig,
                    sensorCalibrationData: preparedScanCalibrationData,
                });

                await log(
                    'sensor/calibrate:preparedScanCalibrationData',
                    preparedScanCalibrationData,
                );
                await log('sensor/calibrate:preferConfig === configs.activeConfig', result);

                break;
            } else {
                // check if it matches one of our configs
                for (
                    let configIndex = 0;
                    configIndex < configs.configsAvailable.length;
                    configIndex++
                ) {
                    const avaliableConfig =
                        (configs.configsAvailable[configIndex] as string)?.toLowerCase() ?? '';

                    await log('sensor/calibrate:preferConfig', preferConfig);
                    await log('sensor/calibrate:avaliableConfig', avaliableConfig);

                    if (avaliableConfig === preferConfig) {
                        // we found a config that we can use. Its not active, se we need to set the device accordantly
                        await tellspecSetActiveConfig({ name: preferConfig });

                        const preparedScanCalibrationData = tellspecPrepareScanCalibration({
                            userEmail: user.email,
                            model: sensor.currentDevice.name,
                            activeConfigName: preferConfig,
                            sensorScannedData: preparedSensorScannedData,
                        });

                        result = getPreparedCalibration({
                            currentDevice: sensor.currentDevice,
                            preferConfig,
                            sensorCalibrationData: preparedScanCalibrationData,
                        });

                        await log(
                            'sensor/calibrate:preparedScanCalibrationData',
                            preparedScanCalibrationData,
                        );
                        await log('sensor/calibrate:preferConfig === avaliableConfig', result);

                        break;
                    }
                }
            }
        }

        await log('sensor/calibrate:result', result);

        if (!result) {
            throw new Error("Sensor doesn't a valid config.");
        }

        const updatedDevice = { ...sensor.currentDevice };

        updatedDevice.activeCal = result;
        updatedDevice.activeConfig = result.config;

        await log('sensor/calibrate:updatedDevice', updatedDevice);

        const calibrationResult = {
            calibrationData: result,
            updatedDevice,
        };

        await log('sensor/calibrate:calibrationResult', calibrationResult);

        return calibrationResult;
    } catch (error: any) {
        await log('sensor/calibrate:error', error);

        if (isSensorDisconnectedError(error)) {
            throw new Error(error);
        }

        throw error;
    }
});

export const warmupSensorDevice = createAsyncThunk('sensor/warmupSensor', async (_, thunkAPI) => {
    const { sensor } = thunkAPI.getState() as RootState;

    await log('sensor/warmupSensor:currentDevice', sensor.currentDevice);

    if (!sensor.currentDevice) {
        return;
    }

    try {
        await tellspecRetrieveDeviceConnect(sensor.currentDevice.uuid);

        const maxRetries = 15;

        let currentRetry = 0;
        let warmupSensorStatus = sensor.warmupSensorStatus;

        while (currentRetry < maxRetries && warmupSensorStatus === 'progress') {
            const scanResult = await tellspecStartScan();

            const dataToLog = {
                SysHumidity: scanResult.SysHumidity,
                SysTemperature: scanResult.SysTemperature,
                HWRev: scanResult.HWRev,
                SerialNumber: scanResult.SerialNumber,
                TivaRev: scanResult.TivaRev,
                SpectrumRev: scanResult.SpectrumRev,
                KeyTimestamp: scanResult.KeyTimestamp,
                ADCPGA: scanResult.ADCPGA,
            };

            logForServer('warmup-scan', dataToLog);

            await thunkAPI.dispatch(getSensorStatus()).unwrap();

            warmupSensorStatus = (thunkAPI.getState() as RootState).sensor.warmupSensorStatus;
            currentRetry++;
        }
    } catch (error: any) {
        await log('sensor/warmupSensor:error', error);

        if (isSensorDisconnectedError(error)) {
            throw new Error(error);
        }

        throw error;
    }
});

export const saveActiveCalibrationSensor = createAsyncThunk(
    'sensor/saveActiveCalibration',
    async (_, thunkAPI) => {
        const { sensor } = thunkAPI.getState() as RootState;

        if (!sensor.currentDevice) {
            return;
        }

        const activeCalibration = sensor.currentDevice.activeCal;
        const activeCalibrationConfig = sensor.currentDevice.activeConfig;

        if (!activeCalibration || !activeCalibrationConfig) {
            return;
        }

        const requestCalibration: SetCalibrationRequest = {
            model: sensor.currentDevice.name,
            serial_number: sensor.currentDevice.serial,
            white_reference: activeCalibration.scan,
        };

        await apiInstance.sensor.setCalibration(requestCalibration);

        const preparedCalibration = getPreparedCalibration({
            currentDevice: sensor.currentDevice,
            preferConfig: activeCalibrationConfig,
            sensorCalibrationData: activeCalibration.scan,
        });

        console.log('[sensor/saveCalibration]: result', preparedCalibration);
        await nativeStore.set(NativeStorageKeys.DEVICE_CALIBRATION, preparedCalibration);

        return preparedCalibration;
    },
);

export const removeDevice = createAsyncThunk(
    'sensor/removeDevice',
    async (deviceUuid: string, thunkAPI) => {
        const { sensor } = thunkAPI.getState() as RootState;

        let removedCurrent = false;

        if (sensor.currentDevice?.uuid === deviceUuid) {
            await tellspecRemoveDevice();

            removedCurrent = true;
        }

        return {
            removedUuid: deviceUuid,
            removedCurrent,
        };
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
            if (!sensor.currentDevice) {
                throw new Error(SENSOR_DISCONNECTED);
            }

            if (await isEmulateNativeSdk()) {
                const response = await apiInstance.sensor.getScanData(EMULATION_SCAN_ID);

                if (response.data === null || response.data.length === 0) {
                    return null;
                }

                const [spectrumScanDataItem] = response.data;

                return {
                    saveScanResponse: {
                        'scan-validation': 'ok',
                    },
                    sensorScannedData: prepareSpectrumScanData(spectrumScanDataItem),
                };
            }

            return tellspecRunScan(sensor.currentDevice, userEmail);
        } catch (error: any) {
            console.error(error);

            if (isSensorDisconnectedError(error)) {
                throw new Error(error);
            }

            throw new Error("Can't run sensor scanning. Try again later");
        }
    },
);

export const getSensorStatus = createAsyncThunk('sensor/getSensorStatus', async (_, thunkAPI) => {
    const { sensor } = thunkAPI.getState() as RootState;

    try {
        if (!sensor.currentDevice) {
            throw new Error(SENSOR_DISCONNECTED);
        }

        const sensorStatus = await tellspecGetSensorStatus();

        await log('sensor/getSensorStatus:sensorStatus', sensorStatus);

        return sensorStatus;
    } catch (error) {
        console.error(error);

        if (isSensorDisconnectedError(error)) {
            return thunkAPI.rejectWithValue(SENSOR_DISCONNECTED);
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
