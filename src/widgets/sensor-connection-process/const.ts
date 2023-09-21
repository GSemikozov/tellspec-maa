import { SensorConnectionProcessStatus } from './sensor-connection-process-context';

export const STATUS_TOAST_MESSAGE: Partial<Record<SensorConnectionProcessStatus, string>> = {
    idle: '',
    error: 'Something went wrong',

    checkingBle: 'Check BLE permissions and connection status...',
    discovering: 'Discover for sensors... Found: ${count} sensors',
    pairingDiscovedDevice: 'Pairing sensor...',
    pairingSuccess: 'Paring was a success',
};
