import { Plugins } from '@capacitor/core';
// import {
//     TellspecSensorSdkPlugin,
//     ScanResultType,
//     TellspecDeviceConfig,
//     SensorState,
// } from 'tellspec-sensor-sdk/src/definitions';

import { TellspecSensorBaseResponse, retrieveBlePermissions } from '@api/native';

import { createTellspecErrorResponse } from './utils';

import 'tellspec-sensor-sdk/src';

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export class TellspecSensorSdkWeb extends WebPlugin implements TellspecSensorSdkPlugin {
//     constructor() {
//         super({
//             name: 'TellspecSensorSdk',
//             platforms: ['web'],
//         });
//     }

//     async initialize(): Promise<void> {
//         throw new Error('Method not implemented.');
//     }

//     async startScan(): Promise<ScanResultType> {
//         throw new Error('Method not implemented.');
//     }
//     async warmup(): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     async enableDiscovery(): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     async savePreferDevice(): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     async getPreferredDevices(): Promise<{ value: { device: any } }> {
//         throw new Error('Method not implemented.');
//     }
//     async connect(): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     async disconnect(): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     async readScannerInfo(): Promise<{ model: string; serial: string }> {
//         throw new Error('Method not implemented.');
//     }
//     async getSensorStatus(): Promise<SensorState> {
//         throw new Error('Method not implemented.');
//     }
//     async getConfigs(): Promise<TellspecDeviceConfig> {
//         throw new Error('Method not implemented.');
//     }
//     async setActiveConfig(): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     async forgetDevice(): Promise<void> {
//         throw new Error('Method not implemented.');
//     }
//     async getConnectionState(): Promise<{ state: boolean; ble: boolean }> {
//         await sleep(1_500);

//         return {
//             ble: true,
//             state: true,
//         };
//     }
// }

// const TellspecSensorSdk = new TellspecSensorSdkWeb();
console.log(Plugins);
const { TellspecSensorSdk } = Plugins;

export const tellspecCheckBleState = async (): Promise<TellspecSensorBaseResponse> => {
    try {
        const hasBlePermission = await retrieveBlePermissions();

        if (!hasBlePermission) {
            return createTellspecErrorResponse('Missing Bluetooth permission');
        }

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
