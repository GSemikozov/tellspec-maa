import React from 'react';

import { SensorConnectionProcessStatus } from './types';

import type { TellspecSensorDevice } from '@api/native';

export type SensorConnectionProcessContextValue = {
    status: SensorConnectionProcessStatus;

    discoveredDevices: TellspecSensorDevice[];
    discoveredDevicesModalOpen: boolean;

    onStartDiscovery: () => Promise<void>;
    onCancelDiscovery: () => void;
    onOpenDiscoveryDevicesModal: () => void;
    onCloseDiscoveryDevicesModal: () => void;
    onConnectDevice: (device: TellspecSensorDevice) => void;

    onResetStatus: () => void;
};

export const SensorConnectionProcessContext =
    // @ts-ignore: we setup the initial value in provider below
    React.createContext<SensorConnectionProcessContextValue>();
