import { SensorConnectionProcessStatus } from './sensor-connection-process-context';

export const STATUS_TOAST_MESSAGE: Partial<Record<SensorConnectionProcessStatus, string>> = {
    idle: '',
    error: 'Something went wrong',

    checkingBle: 'Check BLE permissions and connection status...',
    discovering: 'Searching sensors... Found: ${count} sensor',
    pairingDiscovedDevice: 'Pairing sensor...',
    pairingSuccess: 'Paring was a success',
};
