import { SensorConnectionProcessStatus } from './sensor-connection-process-context';

export const STATUS_TOAST_MESSAGE: Partial<Record<SensorConnectionProcessStatus, string>> = {
    idle: '',
    error: 'Something went wrong',

    checkingBle: 'Check BLE permissions and connection status...',
    discovering: 'Searching for sensors. ${count} found.',
    pairingDiscovedDevice: 'Connecting sensor. This may take a few minutes',
    pairingSuccess: 'Paring was a success',
};
