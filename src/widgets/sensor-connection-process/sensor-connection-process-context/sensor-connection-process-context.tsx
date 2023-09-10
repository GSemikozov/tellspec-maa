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
    tellspecGetPairDevice,
} from '@api/native';
import { sensorActions } from '@entities/sensor';
import { fetchBleStatus } from '@app/model/app.actions';

import { SensorConnectionProcessToast } from '../sensor-connection-process-toast';
import { SensorConnectionProcessDiscoveredDevicesModal } from '../sensor-connection-process-discovered-devices-modal';

import { STATUS_TOAST_MESSAGE } from './const';
import { SensorConnectionProcessStatus } from './types';

import type { PluginListenerHandle } from '@capacitor/core';
import type { AppDispatch } from '@app';
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
    onConnectDevice: (device: TellspecSensorDevice) => void;

    onResetStatus: () => void;
};

type setConnectionProcessStatusOptions = {
    payload?: Record<string, any>;
    customMessage?: string;
    silent?: boolean;
};

export const SensorConnectionProcessContext =
    // @ts-ignore: we setup the initial value in provider below
    React.createContext<SensorConnectionProcessContextValue>();

export const SensorConnectionProcessProvider: React.FunctionComponent<React.PropsWithChildren> = ({
    children,
}) => {
    const mountedRef = React.useRef(false);

    const dispatch = useDispatch<AppDispatch>();

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
            const { customMessage, payload = {}, silent } = options;

            const statusToastMessage = STATUS_TOAST_MESSAGE[status] ?? '';
            const toastMessage = customMessage ?? statusToastMessage;

            setStatus(status);

            if (silent) {
                return;
            }

            setToastMessage(fillTemplateValues(toastMessage, payload));
        },
        [],
    );

    const handleResetStatus = React.useCallback(
        () => setConnectionProcessStatus(SensorConnectionProcessStatus.IDLE),
        [setConnectionProcessStatus],
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

            const nativeBleState = await dispatch(fetchBleStatus()).unwrap();

            if (!nativeBleState) {
                throw new Error('Missing Bluetooth permission');
            }

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

    const connectDevice = React.useCallback(async (device: TellspecSensorDevice) => {
        try {
            const shallowDevice = { ...device };
            const calibrationData = await tellspecGetDeviceInfo(shallowDevice);
            const calibrationReady = Boolean(calibrationData);

            if (calibrationReady) {
                shallowDevice.activeCal = calibrationData;
                shallowDevice.activeConfig = calibrationData.config;
            }

            await tellspecSavePairDevice(shallowDevice);

            dispatch(
                sensorActions.setSensorState({
                    device: shallowDevice,
                    requiredCalibration: !calibrationReady,
                }),
            );
        } catch (error: any) {
            console.error('[connectDevice]: ', error);

            const errorMessage = error.message ?? 'Unabled to pair with sensor';

            throw new Error(errorMessage);
        } finally {
            await tellspecDisconnect();
        }
    }, []);

    const handleConnectDevice = React.useCallback(async (device: TellspecSensorDevice) => {
        setConnectionProcessStatus(SensorConnectionProcessStatus.PAIRING_DISCOVERED_DEVICE);

        try {
            handleCloseDiscoveryDevicesModal();

            await connectDevice(device);

            setConnectionProcessStatus(SensorConnectionProcessStatus.PAIRING_SUCCESS);
        } catch (error: any) {
            setConnectionProcessStatus(SensorConnectionProcessStatus.ERROR, {
                customMessage: error.message,
            });
        }
    }, []);

    React.useEffect(() => {
        const retrievePairedDeviceFromStorage = async () => {
            const storeDevice = await tellspecGetPairDevice();

            if (storeDevice === null) {
                return;
            }

            await connectDevice(storeDevice);

            setConnectionProcessStatus(SensorConnectionProcessStatus.PAIRING_SUCCESS, {
                silent: true,
            });
        };

        if (!mountedRef.current) {
            mountedRef.current = true;

            retrievePairedDeviceFromStorage();
        }
    }, [connectDevice]);

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
            onConnectDevice: handleConnectDevice,

            onResetStatus: handleResetStatus,
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
            handleConnectDevice,

            handleResetStatus,
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
