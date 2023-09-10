import React from 'react';

import { PreemieToast } from '@shared/ui';
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

const TOAST_TYPE_BY_STATUS = {
    [SensorConnectionProcessStatus.ERROR]: 'error',
    [SensorConnectionProcessStatus.PAIRING_SUCCESS]: 'success',
};

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

    const [toastOpen, setToastOpen] = React.useState(false);

    const handleCloseToast = () => setToastOpen(false);

    const duration = LOADING_STATUSES.includes(status) ? undefined : 3_000;

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

    React.useEffect(() => {
        setToastOpen(
            !discoveredDevicesModalOpen &&
                Boolean(toastMessage) &&
                OPENED_STATUSES.includes(status),
        );
    }, [discoveredDevicesModalOpen, toastMessage, status]);

    return (
        <PreemieToast
            id='sensor-connection-process-toast'
            className={cn('')}
            type={TOAST_TYPE_BY_STATUS[status]}
            isOpen={toastOpen}
            message={toastMessage}
            duration={duration}
            buttons={toastButtons}
            onDidDismiss={handleCloseToast}
        />
    );
};
