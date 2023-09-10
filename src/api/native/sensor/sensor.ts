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
import { isGivenDateOlderThan } from '@shared/time';

import { createTellspecErrorResponse } from './utils';

import type { ListenerCallback } from '@capacitor/core';
import type {
    SensorEvent,
    ScanResultType,
    BleDeviceInfo,
} from 'tellspec-sensor-sdk/src/definitions';

const { TellspecSensorSdk } = Plugins;

/**
 * This is how old a calibraiton can be before it needs re-calibrating in
 *
 * @note its currently set to 30days
 * MaxTimeSinceLastCalibrationMs = (days * hours * minutes * seconds * ms)
 */
const maxTimeSinceLastCalibrationMs = 30 * 24 * 60 * 60 * 1000;

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

export const tellspecGetDeviceInfo = async (device: BleDeviceInfo): Promise<any> => {
    if (await isEmulateNativeSdk()) {
        const emulateResponse = {
            scan: {},
        };

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

        const mismatchSerialNumber =
            device.serial !== sensorCalibration.scan['scan-data']['scanner-serial-number'];

        const needRecalibrationTimeIssue = isGivenDateOlderThan(
            sensorCalibration['last_modified_at'],
            maxTimeSinceLastCalibrationMs,
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

export const tellspecNormalizeScanCalibration = (
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
            'scan-id': uuid,
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
 * Cleans update the data we received from the sensor
 */
export const tellspecCleanScanData = (scanData: ScanResultType): ScanResultType => {
    scanData.uuid = uuid();
    scanData.wavelengths = JSON.parse(scanData.wavelengths);
    scanData.ReferenceIntensity = JSON.parse(scanData.ReferenceIntensity);
    scanData.Intensity = JSON.parse(scanData.Intensity);

    return scanData;
};
