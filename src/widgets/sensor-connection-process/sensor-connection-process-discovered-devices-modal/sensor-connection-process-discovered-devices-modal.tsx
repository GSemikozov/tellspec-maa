import { IonButton, IonModal } from '@ionic/react';

import { BluetoothItem } from '@entities/bluetooth/ui';
import { classname } from '@shared/utils';

import './sensor-connection-process-discovered-devices-modal.css';
import { useSensorConnectionProcess } from '../sensor-connection-process-context';

const cn = classname('sensor-connection-process-discovered-devices-modal');

export const SensorConnectionProcessDiscoveredDevicesModal = () => {
    const {
        discoveredDevices,
        discoveredDevicesModalOpen,
        onCloseDiscoveryDevicesModal,
        onConnectDevice,
        onCancelDiscovery,
    } = useSensorConnectionProcess();

    const hasDiscoveredDevices = discoveredDevices.length > 0;

    return (
        <IonModal
            className={cn()}
            isOpen={discoveredDevicesModalOpen}
            onDidDismiss={onCloseDiscoveryDevicesModal}
        >
            <div className={cn('container')}>
                <div className={cn('header')}>
                    <h3>Discovered devices</h3>
                </div>

                {hasDiscoveredDevices ? (
                    <div className={cn('main')}>
                        <div className={cn('main-devices-list')}>
                            {discoveredDevices.map(device => (
                                <BluetoothItem
                                    key={device.uuid}
                                    device={device}
                                    onClick={onConnectDevice}
                                />
                               
                            ))}
                        </div>
                        <div className={cn('main-actions')}>
                            <IonButton fill='outline' color='tertiary' onClick={onCancelDiscovery}>
                                Cancel
                            </IonButton>
                        </div>
                    </div>
                ) : null}
               
            </div>
        </IonModal>
    );
};
