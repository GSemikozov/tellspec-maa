import React from 'react';

import { PreemieToast } from '@shared/ui';
import { useEvent } from '@shared/hooks';

import {
    useSensorConnectionProcess,
    SensorConnectionProcessStatus,
} from '../sensor-connection-process-context';
import { createToastMessage } from '../utils';

import type { ToastButton } from '@ionic/react';

const LOADING_STATUSES: SensorConnectionProcessStatus[] = [
    SensorConnectionProcessStatus.CHECKING_BLE,
    SensorConnectionProcessStatus.DISCOVERING,
    SensorConnectionProcessStatus.PAIRING_DISCOVERED_DEVICE,
];

export const SensorConnectionProcessLoaderToast: React.FunctionComponent = () => {
    const {
        status,
        discoveredDevices,
        discoveredDevicesModalOpen,
        onOpenDiscoveryDevicesModal,
        onCancelDiscovery,
    } = useSensorConnectionProcess();

    const handleOpenDiscoveryDevicesModalEvent = useEvent(onOpenDiscoveryDevicesModal);
    const handleCancelDiscoveryEvent = useEvent(onCancelDiscovery);

    const toastMessage = createToastMessage(status, {
        discoveredDeviceLength: discoveredDevices.length,
    });

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

    const isToastOpen =
        !discoveredDevicesModalOpen && Boolean(toastMessage) && LOADING_STATUSES.includes(status);

    if (!isToastOpen) {
        return null;
    }

    return (
        <PreemieToast
            isOpen
            id='sensor-connection-process-loader-toast'
            position='top'
            message={toastMessage}
            buttons={toastButtons}
        />
    );
};
