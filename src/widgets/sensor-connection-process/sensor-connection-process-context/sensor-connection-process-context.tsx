import React from 'react';

import { SensorConnectionProcessStatus } from './types';

import type { TellspecSensorDevice } from '@api/native';

type onStartDiscoveryOptions = {
    enableBleCheck?: boolean;
};

export type SensorConnectionProcessContextValue = {
    status: SensorConnectionProcessStatus;
    loading: boolean;

    discoveredDevices: TellspecSensorDevice[];
    discoveredDevicesModalOpen: boolean;

    onStartDiscovery: (options?: onStartDiscoveryOptions) => Promise<void>;
    onCancelDiscovery: () => void;
    onOpenDiscoveryDevicesModal: () => void;
    onCloseDiscoveryDevicesModal: () => void;
    onConnectDevice: (device: TellspecSensorDevice) => void;
    onRetrievePairedDeviceFromStorage: () => Promise<void>;

    onResetStatus: () => void;
};

export const SensorConnectionProcessContext =
    // @ts-ignore: we setup the initial value in provider below
    React.createContext<SensorConnectionProcessContextValue>();
