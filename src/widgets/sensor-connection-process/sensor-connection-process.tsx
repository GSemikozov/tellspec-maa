import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SensorEvent } from 'tellspec-sensor-sdk/src/definitions';

import { usePreemieToast } from '@ui';
import {
    isEmulateNativeSdk,
    tellspecNotifyListeners,
    tellspecAddListener,
    tellspecCheckBleState,
    tellspecEnableDiscovery,
    nativeStore,
    NativeStorageKeys,
} from '@api/native';
import {
    connectSensorDevice,
    getSensorStatus,
    selectSensorDevice,
    useCalibrateSensor,
} from '@entities/sensor';
import { fetchBleStatus } from '@app/model/app.actions';
import { userSelectors } from '@entities/user';

import { SensorConnectionProcessLoaderToast } from './sensor-connection-process-loader-toast';
import { SensorConnectionProcessDiscoveredDevicesModal } from './sensor-connection-process-discovered-devices-modal';
import {
    SensorConnectionProcessContext,
    SensorConnectionProcessStatus,
} from './sensor-connection-process-context';
import { createToastMessage } from './utils';

import type { PluginListenerHandle } from '@capacitor/core';
import type { AppDispatch } from '@app';
import type { TellspecListenerEvents, TellspecSensorDevice } from '@api/native';
import type { SensorConnectionProcessContextValue } from './sensor-connection-process-context';

const LOADING_STATUSES: SensorConnectionProcessStatus[] = [
    SensorConnectionProcessStatus.CHECKING_BLE,
    SensorConnectionProcessStatus.DISCOVERING,
    SensorConnectionProcessStatus.PAIRING_DISCOVERED_DEVICE,
];

export const SensorConnectionProcessProvider: React.FunctionComponent<React.PropsWithChildren> = ({
    children,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [presentToast] = usePreemieToast();

    const [calibrateSensor] = useCalibrateSensor();

    const mountedRef = React.useRef(false);

    const isAuthenticated = useSelector(userSelectors.isUserAuthenticated);
    const currentDevice = useSelector(selectSensorDevice);

    const [status, setStatus] = React.useState<SensorConnectionProcessContextValue['status']>(
        SensorConnectionProcessStatus.IDLE,
    );

    const [updateDiscoveredDevicesListener, setUpdateDiscoveredDevicesListener] =
        React.useState<PluginListenerHandle | null>(null);

    const [discoveredDevicesModalOpen, setDiscoveredDevicesModalOpen] = React.useState(false);

    const [discoveredDevices, setDiscoveredDevices] = React.useState<
        SensorConnectionProcessContextValue['discoveredDevices']
    >([]);

    const handleResetStatus = React.useCallback(
        () => setStatus(SensorConnectionProcessStatus.IDLE),
        [],
    );

    const handleOpenDiscoveryDevicesModal = React.useCallback(() => {
        setStatus(SensorConnectionProcessStatus.CHOOSE_DISCOVERED_DEVICE);
        setDiscoveredDevicesModalOpen(true);
    }, []);

    const handleCloseDiscoveryDevicesModal = React.useCallback(() => {
        setStatus(SensorConnectionProcessStatus.DISCOVERING);
        setDiscoveredDevicesModalOpen(false);
    }, []);

    const handleStartDiscovery: SensorConnectionProcessContextValue['onStartDiscovery'] =
        React.useCallback(async ({ enableBleCheck } = {}) => {
            try {
                if (enableBleCheck) {
                    setStatus(SensorConnectionProcessStatus.CHECKING_BLE);

                    const nativeBleState = await dispatch(fetchBleStatus()).unwrap();

                    if (!nativeBleState) {
                        throw new Error('Missing Bluetooth permission');
                    }

                    const tellspecBleState = await tellspecCheckBleState();

                    if (tellspecBleState.status === 'error') {
                        throw new Error(tellspecBleState.message);
                    }
                }

                setStatus(SensorConnectionProcessStatus.DISCOVERING);

                await tellspecEnableDiscovery();
            } catch (error: any) {
                const errorMessage = error.message ?? 'Error on start discovery';

                setStatus(SensorConnectionProcessStatus.ERROR);

                await presentToast({
                    type: 'error',
                    message: errorMessage,
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
        }, []);

    const handleCancelDiscovery = React.useCallback(() => {
        setStatus(SensorConnectionProcessStatus.IDLE);
        setDiscoveredDevicesModalOpen(false);

        setDiscoveredDevices([]);
        setUpdateDiscoveredDevicesListener(null);
    }, [handleCloseDiscoveryDevicesModal]);

    const handleConnectDevice = React.useCallback(async (device: TellspecSensorDevice) => {
        setStatus(SensorConnectionProcessStatus.PAIRING_DISCOVERED_DEVICE);
        setDiscoveredDevicesModalOpen(false);

        try {
            const { requiredCalibration } = await dispatch(connectSensorDevice(device)).unwrap();

            setStatus(SensorConnectionProcessStatus.PAIRING_SUCCESS);

            await presentToast({
                type: 'success',
                message: createToastMessage(SensorConnectionProcessStatus.PAIRING_SUCCESS),
            });

            if (requiredCalibration) {
                await calibrateSensor(device);
            }

            await dispatch(getSensorStatus()).unwrap();
        } catch (error: any) {
            setStatus(SensorConnectionProcessStatus.ERROR);

            await presentToast({
                type: 'error',
                message: error?.message,
            });
        }
    }, []);

    const handleRetrievePairedDeviceFromStorage = React.useCallback(async () => {
        if (!isAuthenticated) {
            return;
        }

        try {
            const storageDevice = await nativeStore.get(NativeStorageKeys.DEVICE);

            if (!storageDevice) {
                return;
            }

            await dispatch(connectSensorDevice(storageDevice)).unwrap();

            setStatus(SensorConnectionProcessStatus.PAIRING_SUCCESS);
        } catch (error: any) {
            setStatus(SensorConnectionProcessStatus.ERROR);

            await presentToast({
                type: 'error',
                message: error?.message,
            });
        }
    }, [isAuthenticated, connectSensorDevice]);

    React.useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;

            handleRetrievePairedDeviceFromStorage();
        }
    }, [handleRetrievePairedDeviceFromStorage]);

    React.useEffect(() => {
        const resetListener = () => {
            if (updateDiscoveredDevicesListener) {
                updateDiscoveredDevicesListener.remove();
                setUpdateDiscoveredDevicesListener(null);
            }
        };

        if (!isAuthenticated || currentDevice !== null) {
            resetListener();

            return;
        }

        if (currentDevice === null && updateDiscoveredDevicesListener === null) {
            setUpdateDiscoveredDevicesListener(
                tellspecAddListener(
                    SensorEvent.DEVICE_LIST,
                    (data: TellspecListenerEvents.UpdateDeviceList) => {
                        console.log('tellspecAddListener[SensorEvent.DEVICE_LIST]', data);

                        if (data.devices.length === 0) {
                            return;
                        }

                        const newDiscoveredDevices = data.devices.filter(device =>
                            device.name.includes('T11'),
                        );

                        setDiscoveredDevices(newDiscoveredDevices);
                    },
                ),
            );

            return;
        }

        return () => {
            resetListener();
        };
    }, [isAuthenticated, currentDevice]);

    const context = React.useMemo(
        () => ({
            status,
            loading: LOADING_STATUSES.includes(status),

            discoveredDevices,
            discoveredDevicesModalOpen,

            onStartDiscovery: handleStartDiscovery,
            onCancelDiscovery: handleCancelDiscovery,
            onOpenDiscoveryDevicesModal: handleOpenDiscoveryDevicesModal,
            onCloseDiscoveryDevicesModal: handleCloseDiscoveryDevicesModal,
            onConnectDevice: handleConnectDevice,
            onRetrievePairedDeviceFromStorage: handleRetrievePairedDeviceFromStorage,

            onResetStatus: handleResetStatus,
        }),
        [
            status,
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

            <SensorConnectionProcessLoaderToast />
            <SensorConnectionProcessDiscoveredDevicesModal />
        </SensorConnectionProcessContext.Provider>
    );
};
