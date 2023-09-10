import React from 'react';
import { IonToast } from '@ionic/react';

import { classname } from '@shared/utils';
import { useEvent } from '@shared/hooks';

import {
    useSensorConnectionProcess,
    SensorConnectionProcessStatus,
} from '../sensor-connection-process-context';

import './sensor-connection-process-toast.css';

import type { ToastButton } from '@ionic/react';

const cn = classname('sensor-connection-process-toast');

const OPENED_STATUSES: SensorConnectionProcessStatus[] = [
    SensorConnectionProcessStatus.ERROR,
    SensorConnectionProcessStatus.CHECKING_BLE,
    SensorConnectionProcessStatus.DISCOVERING,
    SensorConnectionProcessStatus.PAIRING_DISCOVERED_DEVICE,
    SensorConnectionProcessStatus.PAIRING_SUCCESS,
];

const LOADING_STATUSES: SensorConnectionProcessStatus[] = [
    SensorConnectionProcessStatus.CHECKING_BLE,
    SensorConnectionProcessStatus.DISCOVERING,
    SensorConnectionProcessStatus.PAIRING_DISCOVERED_DEVICE,
];

export const SensorConnectionProcessToast: React.FunctionComponent = () => {
    const {
        status,
        toastMessage,
        discoveredDevices,
        discoveredDevicesModalOpen,
        onOpenDiscoveryDevicesModal,
        onCancelDiscovery,
    } = useSensorConnectionProcess();

    const handleOpenDiscoveryDevicesModalEvent = useEvent(onOpenDiscoveryDevicesModal);
    const handleCancelDiscoveryEvent = useEvent(onCancelDiscovery);

    const isOpen = !discoveredDevicesModalOpen && OPENED_STATUSES.includes(status);
    const duration = LOADING_STATUSES.includes(status) ? undefined : 6_000;

    const toastButtons = React.useMemo(() => {
        const discoveredDevicesLength = discoveredDevices.length;
        const buttons: ToastButton[] = [];

        if (status === SensorConnectionProcessStatus.DISCOVERING) {
            if (discoveredDevicesLength > 0) {
                buttons.push({
                    text: 'Open devices',
                    role: 'open',
                    handler: handleOpenDiscoveryDevicesModalEvent,
                });
            }

            buttons.push({
                text: 'Cancel discovery',
                role: 'cancel',
                handler: handleCancelDiscoveryEvent,
            });
        }

        return buttons;
    }, [
        status,
        discoveredDevices,
        handleOpenDiscoveryDevicesModalEvent,
        handleCancelDiscoveryEvent,
    ]);

    return (
        <IonToast
            className={cn('', {
                success: status === SensorConnectionProcessStatus.PAIRING_SUCCESS,
                error: status === SensorConnectionProcessStatus.ERROR,
            })}
            isOpen={isOpen}
            message={toastMessage}
            duration={duration}
            buttons={toastButtons}
        />
    );
};
