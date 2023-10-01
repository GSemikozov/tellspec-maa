import React from 'react';

import { PreemieToast } from '@ui';
import { useEvent } from '@shared/hooks';

import {
    useSensorConnectionProcess,
    SensorConnectionProcessStatus,
} from '../sensor-connection-process-context';
import { createToastMessage } from '../utils';

import type { ToastButton } from '@ionic/react';

export const SensorConnectionProcessLoaderToast: React.FunctionComponent = () => {
    const {
        status,
        loading,
        discoveredDevices,
        discoveredDevicesModalOpen,
        onOpenDiscoveryDevicesModal,
        onCancelDiscovery,
    } = useSensorConnectionProcess();

    const handleOpenDiscoveryDevicesModalEvent = useEvent(onOpenDiscoveryDevicesModal);
    const handleCancelDiscoveryEvent = useEvent(onCancelDiscovery);

    const [toastOpen, setToastOpen] = React.useState(false);

    const toastMessage = createToastMessage(status, {
        discoveredDeviceLength: discoveredDevices.length,
    });

    const toastButtons = React.useMemo(() => {
        const discoveredDevicesLength = discoveredDevices.length;
        const buttons: ToastButton[] = [];

        if (status === SensorConnectionProcessStatus.DISCOVERING) {
            if (discoveredDevicesLength > 0) {
                buttons.push({
                    text: 'Open sensors',
                    role: 'open',
                    handler: handleOpenDiscoveryDevicesModalEvent,
                });
            }

            buttons.push({
                text: 'Cancel',
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
        const isToastOpen = !discoveredDevicesModalOpen && loading && Boolean(toastMessage);

        setToastOpen(isToastOpen);
    }, [discoveredDevicesModalOpen, toastMessage, loading]);

    return (
        <PreemieToast
            animated={false}
            id='sensor-connection-process-loader-toast'
            isOpen={toastOpen}
            message={toastMessage}
            buttons={toastButtons}
        />
    );
};
