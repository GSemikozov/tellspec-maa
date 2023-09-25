import moment from 'moment';
import { Plugins } from '@capacitor/core';
import { getPlatforms } from '@ionic/react';
import { v4 as uuid } from 'uuid';
import 'tellspec-sensor-sdk/src';

import {
    isEmulateNativeSdk,
    NativeStorageKeys,
    nativeStore,
    TellspecRawSensorScannedData,
    TellspecSensorBaseResponse,
    TellspecSensorDevice,
    TellspecSensorScannedData,
} from '@api/native';
import { apiInstance } from '@api/network';
import { CalibrationType } from '@entities/sensor';
import { isGivenDateOlderThan } from '@shared/time';

import { createTellspecErrorResponse } from './utils';

import type { ListenerCallback } from '@capacitor/core';
import type { RunModelRequest } from '@entities/sensor';
import type { SensorEvent } from 'tellspec-sensor-sdk/src/definitions';

const { TellspecSensorSdk } = Plugins;

/**
 * This is how old a calibraiton can be before it needs re-calibrating in
 *
 * @note its currently set to 30days
 * MAX_TIME_SINCE_LAST_CALIBRATION_MS = (days * hours * minutes * seconds * ms)
 */
const MAX_TIME_SINCE_LAST_CALIBRATION_MS = 30 * 24 * 60 * 60 * 1000;

// used only in emulation
export const tellspecNotifyListeners = (eventName: SensorEvent, data: any) => {
    return TellspecSensorSdk.notifyListeners(eventName, data);
};

export const tellspecAddListener = (eventName: SensorEvent, listenerFunc: ListenerCallback) => {
    // @ts-ignore: TODO: fix types
    return TellspecSensorSdk.addListener(eventName, listenerFunc);
};

export const tellspecGetSensorStatus = async () => {
    console.log('run tellspecGetSensorStatus');
    return TellspecSensorSdk.getSensorStatus();
};

export const tellspecEnableDiscovery = async () => {
    return TellspecSensorSdk.enableDiscovery();
};

export const tellspecConnect = async (options: { address: string }) => {
    return TellspecSensorSdk.connect(options);
};

export const tellspecReadScannerInfo = async () => {
    return TellspecSensorSdk.readScannerInfo();
};

export const tellspecGetConfigs = async () => {
    return TellspecSensorSdk.getConfigs();
};

export const tellspecStartScan = async () => {
    return TellspecSensorSdk.startScan();
};

export const tellspecSetActiveConfig = async (options: { name: string }) => {
    return TellspecSensorSdk.setActiveConfig(options);
};

export const tellspecDisconnect = async () => {
    return TellspecSensorSdk.disconnect();
};

export const tellspecCheckBleState = async (): Promise<TellspecSensorBaseResponse> => {
    try {
        const tellspecSensorConnectionState = await TellspecSensorSdk.getConnectionState();

        if (!tellspecSensorConnectionState.ble) {
            return createTellspecErrorResponse('Bluetooth is disconnected');
        }
    } catch (error) {
        console.error('[tellspecCheckBleState]: ', error);
    }

    return {
        status: 'ok',
    };
};

export const tellspecRetrieveDeviceConnect = async (deviceUuid: string) => {
    await tellspecConnect({ address: deviceUuid });
    await tellspecReadScannerInfo();

    return async () => {
        await tellspecDisconnect();
    };
};

export const tellspecGetDeviceInfo = async (device: TellspecSensorDevice): Promise<any> => {
    if (await isEmulateNativeSdk()) {
        const emulateResponse = null;

        console.log('[tellspecGetDeviceInfo/emulate]');
        return emulateResponse;
    }

    if (device.name === '' || device.serial === '') {
        throw new Error('Missing device info');
    }

    const getCalibration = async (config: string) => {
        const sensorCalibration = await apiInstance.sensor.getCalibration(
            device.name,
            device.serial,
            config,
        );

        if (!sensorCalibration) {
            return null;
        }

        const mismatchSerialNumber = sensorCalibration.scan['scan-data'][
            'scanner-serial-number'
        ].startsWith(device.serial);

        const needRecalibrationTimeIssue = isGivenDateOlderThan(
            sensorCalibration['last_modified_at'],
            MAX_TIME_SINCE_LAST_CALIBRATION_MS,
        );

        // mismatch of serial number or the calibration is out of date
        if (mismatchSerialNumber || needRecalibrationTimeIssue) {
            await nativeStore.set(NativeStorageKeys.DEVICE_CALIBRATION, null);

            return null;
        }

        await nativeStore.set(NativeStorageKeys.DEVICE_CALIBRATION, sensorCalibration);

        return sensorCalibration;
    };

    // get the scanner data
    const scannerData = await apiInstance.sensor.getScanner(device.name, device.serial);
    console.log('scannerData', scannerData);

    const storageDeviceCalibration = await nativeStore.get(NativeStorageKeys.DEVICE_CALIBRATION);

    if (storageDeviceCalibration) {
        return storageDeviceCalibration;
    }

    // connect and get info
    await tellspecConnect({ address: device.uuid });
    await tellspecReadScannerInfo();

    // get the sensor config
    const configs = await tellspecGetConfigs();

    // we have the device config, now get its calibration
    return getCalibration(configs.activeConfig);
};

export const tellspecGetPairDevice = async (): Promise<TellspecSensorDevice | null> => {
    const storeDevice = await nativeStore.get(NativeStorageKeys.DEVICE);

    return storeDevice?.device ?? null;
};

export const tellspecSavePairDevice = async (device: TellspecSensorDevice): Promise<void> => {
    await nativeStore.set(NativeStorageKeys.DEVICE, { device, scan: null });
};

export const tellspecRemoveDevice = async (): Promise<void> => {
    await TellspecSensorSdk.forgetDevice();
    await nativeStore.remove(NativeStorageKeys.DEVICE);
};

export const tellspecRunScan = async (userEmail: string) => {
    const pairedDevice = await tellspecGetPairDevice();

    if (!pairedDevice) {
        throw new Error('not found paired device');
    }

    const disconnect = await tellspecRetrieveDeviceConnect(pairedDevice.uuid);
    const sensorScannedData = tellspecPrepareSensorScannedData(await tellspecStartScan());

    await tellspecSaveScan(sensorScannedData, pairedDevice, userEmail);
    await disconnect();

    return sensorScannedData;
};

export const tellspecSaveScan = async (
    sensorScannenData: TellspecSensorScannedData,
    device: TellspecSensorDevice,
    userEmail: string,
) => {
    const requestBody = tellspecPrepareScan(sensorScannenData, device, userEmail);
    const saveScanResponse = await apiInstance.sensor.saveScan(requestBody);

    return saveScanResponse;
};

/**
 * Helps create the data structure that we need to send to the server
 *
 * @param scan
 * @param deviceInfo
 * @param uuid
 * @param userEmail
 * @param calibrationData
 */
export const tellspecPrepareScan = (
    sensorScannenData: TellspecSensorScannedData,
    device: TellspecSensorDevice,
    userEmail: string,
): any => {
    const date = moment(sensorScannenData.KeyTimestamp, 'MM/DD/YYYY - HH:mm:ss').format(
        'YYYY-MM-DDTHH:mm:ss',
    );

    let newUuid = sensorScannenData.uuid;

    if (newUuid === '') {
        newUuid = uuid();
    }

    const calWhiteRef = device.activeCal.scan;

    const data = {
        show: true,
        uuid: newUuid,
        json_data: {
            'scan-data': {
                'scanner-type-name': device.name,
                'scanner-hardware-version': sensorScannenData.HWRev,
                'scanner-serial-number': sensorScannenData.SerialNumber,
                'scanner-firmware-version': sensorScannenData.TivaRev,
                'scanner-spectrum-version': sensorScannenData.SpectrumRev,
                'scan-performed-utc': date,
                'scan-id': newUuid,
                'scan-source': 'white',
                wavelengths: sensorScannenData.wavelengths,
                factory_white_ref: [sensorScannenData.ReferenceIntensity],
                white_ref: calWhiteRef['scan-data'].white_ref,
                absorbance: [sensorScannenData.absorbance],
                factory_absorbance: [sensorScannenData.absorbance],
                'active-config-name': calWhiteRef['scan-data']['active-config-name'],
                counts: [sensorScannenData.Intensity],
                debug_trigger: 'N/A',
            },
            'scan-info': {
                dlp_header: {
                    pga: sensorScannenData?.ADCPGA,
                    humidity: sensorScannenData?.SysHumidity,
                    temperature: sensorScannenData?.SysTemperature,
                    white_pga: calWhiteRef['scan-info'].dlp_header.pga,
                    white_humidity: calWhiteRef['scan-info'].dlp_header.humidity,
                    white_temperature: calWhiteRef['scan-info'].dlp_header.temperature,
                },
                device_info: {
                    os: getPlatforms(),
                    version: 'Not set',
                },
                user_email: userEmail,
            },
        },
        created_at: date,
    };

    return data;
};

export type TellspecPrepareScanCalibrationOptions = {
    sensorScannedData: TellspecSensorScannedData;
    model: string;
    activeConfigName: string;
    userEmail: string;

    uuid?: string;
};

export const tellspecPrepareScanCalibration = ({
    sensorScannedData,
    model,
    activeConfigName,
    userEmail,

    uuid: originUuid,
}: TellspecPrepareScanCalibrationOptions): any => {
    const date = moment(sensorScannedData.KeyTimestamp, 'MM/DD/YYYY - HH:mm:ss').format(
        'YYYY-MM-DDTHH:mm:ss',
    );

    let newUuid = originUuid;

    if (newUuid === '') {
        newUuid = uuid();
    }

    return {
        'scan-data': {
            'scanner-type-name': model,
            'scanner-hardware-version': sensorScannedData.HWRev,
            'scanner-serial-number': sensorScannedData.SerialNumber,
            'scanner-firmware-version': sensorScannedData.TivaRev,
            'scanner-spectrum-version': sensorScannedData.SpectrumRev,
            'scan-performed-utc': date,
            'scan-id': newUuid,
            'scan-source': 'white',
            wavelengths: sensorScannedData.wavelengths,
            factory_white_ref: [sensorScannedData.ReferenceIntensity],
            white_ref: [sensorScannedData.Intensity],
            absorbance: [sensorScannedData.absorbance],
            factory_absorbance: [sensorScannedData.absorbance],
            'active-config-name': activeConfigName,
            counts: [sensorScannedData.Intensity],
            debug_trigger: 'N/A',
        },

        'scan-info': {
            dlp_header: {
                pga: sensorScannedData?.ADCPGA,
                humidity: sensorScannedData?.SysHumidity,
                temperature: sensorScannedData?.SysTemperature,
            },
            device_info: {
                os: getPlatforms(),
                version: 'Not Set',
            },
            user_email: userEmail,
        },
    };
};

/**
 * Runs and get the model on the given scans uuid
 *
 * @param scans The list of uuid to return the model data
 * @param average this is the avearage to use
 * @param calToUse this is the calibraiton type to use.
 */
export const tellspecGetModelResult = async (
    scans: string[],
    average?: boolean,
    calToUse?: CalibrationType,
): Promise<any> => {
    const requestBody: RunModelRequest = {
        scans: scans,
        average: average ? average : false,
        'calib-to-use': calToUse ? calToUse : CalibrationType.FACTORY,
    };

    const runModelResponse = await apiInstance.sensor.runModel(requestBody);

    return runModelResponse;
};

/**
 * prepare data that we received by sensor for further usage
 */
export const tellspecPrepareSensorScannedData = (
    rawSensorScanData: TellspecRawSensorScannedData,
): TellspecSensorScannedData => {
    const result = {
        ...rawSensorScanData,
        uuid: uuid(),
        wavelengths: JSON.parse(rawSensorScanData.wavelengths),
        absorbance: JSON.parse(rawSensorScanData.absorbance),
        ReferenceIntensity: JSON.parse(rawSensorScanData.ReferenceIntensity),
        Intensity: JSON.parse(rawSensorScanData.Intensity),
    };

    return result;
};
