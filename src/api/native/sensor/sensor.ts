import moment from 'moment';
import { Plugins } from '@capacitor/core';
import { getPlatforms } from '@ionic/react';
import { v4 as uuid } from 'uuid';
import 'tellspec-sensor-sdk/src';

import {
    isEmulateNativeSdk,
    NativeStorageKeys,
    nativeStore,
    TellspecSensorBaseResponse,
} from '@api/native';
import { apiInstance } from '@api/network';
import { CalibrationType } from '@entities/sensor';
import { isGivenDateOlderThan } from '@shared/time';

import { createTellspecErrorResponse } from './utils';

import type { ListenerCallback } from '@capacitor/core';
import type { RunModelRequest } from '@entities/sensor';
import type {
    SensorEvent,
    ScanResultType,
    BleDeviceInfo,
} from 'tellspec-sensor-sdk/src/definitions';

const { TellspecSensorSdk } = Plugins;

const EMULATION_SCAN_ID = 'c29d7426-16aa-4427-98d3-23b3da6c0d9b';

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

export const tellspecGetDeviceInfo = async (device: BleDeviceInfo): Promise<any> => {
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
    console.log(scannerData);

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

export const tellspecGetPairDevice = async (): Promise<BleDeviceInfo | null> => {
    const storeDevice = await nativeStore.get(NativeStorageKeys.DEVICE);

    return storeDevice?.device ?? null;
};

export const tellspecSavePairDevice = async (device: BleDeviceInfo): Promise<void> => {
    await nativeStore.set(NativeStorageKeys.DEVICE, { device, scan: null });
};

export const tellspecRemoveDevice = async (): Promise<void> => {
    await TellspecSensorSdk.forgetDevice();
    await nativeStore.remove(NativeStorageKeys.DEVICE);
};

export const tellspecRunScan = async (userEmail: string): Promise<any> => {
    if (await isEmulateNativeSdk()) {
        // emulate scan
        return tellspecGetScan(EMULATION_SCAN_ID);
    }

    const pairedDevice = await tellspecGetPairDevice();

    if (!pairedDevice) {
        throw new Error('not found paired device');
    }

    const disconnect = await tellspecRetrieveDeviceConnect(pairedDevice.uuid);

    const startScanResult = await tellspecStartScan();
    const scanData = tellspecCleanScanData(startScanResult);

    await tellspecSaveScan(scanData, pairedDevice, userEmail);
    await disconnect();

    return scanData;
};

export const tellspecGetScan = async (scanId: string): Promise<any> => {
    const scanDataResponse = await apiInstance.sensor.getScanData(scanId);

    if (
        scanDataResponse === null ||
        scanDataResponse.length === 0 ||
        !scanDataResponse[0].json_data?.['scan-data']
    ) {
        throw new Error('Scan data is not available');
    }

    const [firstScanDataEntry] = scanDataResponse;

    const scanData = firstScanDataEntry.json_data['scan-data'];

    const result = {
        ...scanData,
        uuid: firstScanDataEntry.uuid,
        absorbance: scanData.absorbance[0],
    };

    return result;
};

export const tellspecSaveScan = async (
    scanData: any,
    device: BleDeviceInfo,
    userEmail: string,
): Promise<any> => {
    const requestBody = tellspecPrepareScan(scanData, userEmail, device);

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
export const tellspecPrepareScan = (scan: any, userEmail: string, device: any): any => {
    const date = moment(scan.KeyTimestamp, 'MM/DD/YYYY - HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');

    let newUuid = scan.uuid;

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
                'scanner-hardware-version': scan.HWRev,
                'scanner-serial-number': scan.SerialNumber,
                'scanner-firmware-version': scan.TivaRev,
                'scanner-spectrum-version': scan.SpectrumRev,
                'scan-performed-utc': date,
                'scan-id': newUuid,
                'scan-source': 'white',
                wavelengths: scan.wavelengths,
                factory_white_ref: [scan.ReferenceIntensity],
                white_ref: calWhiteRef['scan-data'].white_ref,
                absorbance: [scan.absorbance],
                factory_absorbance: [scan.absorbance],
                'active-config-name': calWhiteRef['scan-data']['active-config-name'],
                counts: [scan.Intensity],
                debug_trigger: 'N/A',
            },
            'scan-info': {
                dlp_header: {
                    pga: scan?.ADCPGA,
                    humidity: scan?.SysHumidity,
                    temperature: scan?.SysTemperature,
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

export const tellspecPrepareScanCalibration = (
    scan: any,
    model: string,
    serial: string,
    originUuid = '',
    userEmail: string,
): any => {
    const date = moment(scan.KeyTimestamp, 'MM/DD/YYYY - HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');

    let newUuid = originUuid;

    if (newUuid === '') {
        newUuid = uuid();
    }

    return {
        'scan-data': {
            'scanner-type-name': model,
            'scanner-hardware-version': scan.HWRev,
            'scanner-serial-number': scan.SerialNumber,
            'scanner-firmware-version': scan.TivaRev,
            'scanner-spectrum-version': scan.SpectrumRev,
            'scan-performed-utc': date,
            'scan-id': newUuid,
            'scan-source': 'white',
            wavelengths: scan.wavelengths,
            factory_white_ref: [scan.ReferenceIntensity],
            white_ref: [scan.Intensity],
            absorbance: [scan.absorbance],
            factory_absorbance: [scan.absorbance],
            'active-config-name': serial,
            counts: [scan.Intensity],
            debug_trigger: 'N/A',
        },

        'scan-info': {
            dlp_header: {
                pga: scan?.ADCPGA,
                humidity: scan?.SysHumidity,
                temperature: scan?.SysTemperature,
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
 * Cleans update the data we received from the sensor
 */
export const tellspecCleanScanData = (scanData: ScanResultType): ScanResultType => {
    const result = {
        ...scanData,
        uuid: uuid(),
        wavelengths: JSON.parse(scanData.wavelengths),
        ReferenceIntensity: JSON.parse(scanData.ReferenceIntensity),
        Intensity: JSON.parse(scanData.Intensity),
    };

    return result;
};
