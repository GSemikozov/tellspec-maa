import React from 'react';
import { useDispatch } from 'react-redux';
import { SensorEvent } from 'tellspec-sensor-sdk/src/definitions';

import { fillTemplateValues } from '@shared/string';
import {
    isEmulateNativeSdk,
    tellspecNotifyListeners,
    tellspecAddListener,
    tellspecCheckBleState,
    tellspecEnableDiscovery,
    tellspecDisconnect,
    tellspecGetDeviceInfo,
    tellspecSavePairDevice,
} from '@api/native';
import { sensorActions } from '@entities/sensor';

import { SensorConnectionProcessToast } from '../sensor-connection-process-toast';
import { SensorConnectionProcessDiscoveredDevicesModal } from '../sensor-connection-process-discovered-devices-modal';

import { STATUS_TOAST_MESSAGE } from './const';
import { SensorConnectionProcessStatus } from './types';

import type { PluginListenerHandle } from '@capacitor/core';
import type { TellspecListenerEvents, TellspecSensorDevice } from '@api/native';

export type SensorConnectionProcessContextValue = {
    status: SensorConnectionProcessStatus;
    toastMessage: string;

    discoveredDevices: TellspecSensorDevice[];
    discoveredDevicesModalOpen: boolean;

    onStartDiscovery: () => Promise<void>;
    onCancelDiscovery: () => void;
    onOpenDiscoveryDevicesModal: () => void;
    onCloseDiscoveryDevicesModal: () => void;
    onChooseDiscoveredDevice: (device: TellspecSensorDevice) => void;
};

type setConnectionProcessStatusOptions = {
    payload?: Record<string, any>;
    customMessage?: string;
};

export const SensorConnectionProcessContext =
    // @ts-ignore: we setup the initial value in provider below
    React.createContext<SensorConnectionProcessContextValue>();

export const SensorConnectionProcessProvider: React.FunctionComponent<React.PropsWithChildren> = ({
    children,
}) => {
    const dispatch = useDispatch();

    const [status, setStatus] = React.useState<SensorConnectionProcessContextValue['status']>(
        SensorConnectionProcessStatus.IDLE,
    );

    const [toastMessage, setToastMessage] = React.useState('');

    const [updateDiscoveredDevicesListener, setUpdateDiscoveredDevicesListener] =
        React.useState<PluginListenerHandle | null>(null);

    const [discoveredDevicesModalOpen, setDiscoveredDevicesModalOpen] = React.useState(false);

    const [discoveredDevices, setDiscoveredDevices] = React.useState<
        SensorConnectionProcessContextValue['discoveredDevices']
    >([]);

    const setConnectionProcessStatus = React.useCallback(
        (
            status: SensorConnectionProcessContextValue['status'],
            options: setConnectionProcessStatusOptions = {},
        ) => {
            const { customMessage, payload = {} } = options;

            const statusToastMessage = STATUS_TOAST_MESSAGE[status] ?? '';
            const toastMessage = customMessage ?? statusToastMessage;

            setStatus(status);
            setToastMessage(fillTemplateValues(toastMessage, payload));
        },
        [],
    );

    const handleOpenDiscoveryDevicesModal = React.useCallback(() => {
        setConnectionProcessStatus(SensorConnectionProcessStatus.CHOOSE_DISCOVERED_DEVICE);

        setDiscoveredDevicesModalOpen(true);
        setUpdateDiscoveredDevicesListener(null);
    }, []);

    const handleCloseDiscoveryDevicesModal = React.useCallback(() => {
        setDiscoveredDevicesModalOpen(false);
    }, []);

    const handleCancelDiscovery = React.useCallback(() => {
        setConnectionProcessStatus(SensorConnectionProcessStatus.IDLE);

        setDiscoveredDevices([]);
        setUpdateDiscoveredDevicesListener(null);

        handleCloseDiscoveryDevicesModal();
    }, [setConnectionProcessStatus, handleCloseDiscoveryDevicesModal]);

    const handleStartDiscovery = React.useCallback(async () => {
        try {
            setConnectionProcessStatus(SensorConnectionProcessStatus.CHECKING_BLE);

            const tellspecBleState = await tellspecCheckBleState();

            if (tellspecBleState.status === 'error') {
                throw new Error(tellspecBleState.message);
            }

            setConnectionProcessStatus(SensorConnectionProcessStatus.DISCOVERING, {
                payload: { count: 0 },
            });

            await tellspecEnableDiscovery();
        } catch (error: any) {
            const errorMessage = error.message ?? 'Error on start discovery';

            setConnectionProcessStatus(SensorConnectionProcessStatus.ERROR, {
                customMessage: errorMessage,
            });
        }

        if (await isEmulateNativeSdk()) {
            setTimeout(() => {
                tellspecNotifyListeners(SensorEvent.DEVICE_LIST, {
                    devices: [
                        {
                            name: 'T11-emulate-device-1',
                            serial: 'emulate-device-1',
                            uuid: 'emulate-device-1',
                            rssi: 'emulate-device-1',
                            type: 'emulate-device-1',
                            originalName: 'emulate-device-1',
                        },
                    ],
                });
            }, 1_000);
        }
    }, [setConnectionProcessStatus]);

    const handleChooseDiscoveredDevice = React.useCallback(async (device: TellspecSensorDevice) => {
        setConnectionProcessStatus(SensorConnectionProcessStatus.PAIRING_DISCOVERED_DEVICE);

        try {
            handleCloseDiscoveryDevicesModal();

            const shallowDevice = { ...device };
            const calibrationData = await tellspecGetDeviceInfo(shallowDevice);
            const requiredCalibration = Boolean(calibrationData);

            if (!requiredCalibration) {
                shallowDevice.activeCal = calibrationData;
                shallowDevice.activeConfig = calibrationData.config;
            }

            await tellspecSavePairDevice(shallowDevice);

            dispatch(
                sensorActions.setSensorState({
                    device: shallowDevice,
                    requiredCalibration,
                }),
            );

            setConnectionProcessStatus(SensorConnectionProcessStatus.PAIRING_SUCCESS);
        } catch (error: any) {
            console.error('[onChooseDiscoveredDevice]: ', error);

            const errorMessage = error.message ?? 'Unabled to pair with sensor';

            setConnectionProcessStatus(SensorConnectionProcessStatus.ERROR, {
                customMessage: errorMessage,
            });
        } finally {
            await tellspecDisconnect();
        }
    }, []);

    React.useEffect(() => {
        if (updateDiscoveredDevicesListener === null) {
            setUpdateDiscoveredDevicesListener(
                tellspecAddListener(
                    SensorEvent.DEVICE_LIST,
                    (data: TellspecListenerEvents.UpdateDeviceList) => {
                        if (data.devices.length === 0) {
                            return;
                        }

                        const newDiscoveredDevices = data.devices.filter(device =>
                            device.name.includes('T11'),
                        );

                        setConnectionProcessStatus(SensorConnectionProcessStatus.DISCOVERING, {
                            payload: { count: newDiscoveredDevices.length },
                        });

                        setDiscoveredDevices(newDiscoveredDevices);
                    },
                ),
            );
        }

        return () => {
            if (updateDiscoveredDevicesListener) {
                updateDiscoveredDevicesListener.remove();
            }
        };
    }, []);

    const context = React.useMemo(
        () => ({
            status,
            toastMessage,

            discoveredDevices,
            discoveredDevicesModalOpen,

            onStartDiscovery: handleStartDiscovery,
            onCancelDiscovery: handleCancelDiscovery,
            onOpenDiscoveryDevicesModal: handleOpenDiscoveryDevicesModal,
            onCloseDiscoveryDevicesModal: handleCloseDiscoveryDevicesModal,
            onChooseDiscoveredDevice: handleChooseDiscoveredDevice,
        }),
        [
            status,
            toastMessage,
            discoveredDevices,
            discoveredDevicesModalOpen,

            handleStartDiscovery,
            handleCancelDiscovery,
            handleOpenDiscoveryDevicesModal,
            handleCloseDiscoveryDevicesModal,
            handleChooseDiscoveredDevice,
        ],
    );

    return (
        <SensorConnectionProcessContext.Provider value={context}>
            {children}

            <SensorConnectionProcessToast />
            <SensorConnectionProcessDiscoveredDevicesModal />
        </SensorConnectionProcessContext.Provider>
    );
};
