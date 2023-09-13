import { SensorConnectionProcessStatus } from './sensor-connection-process-context';

export const STATUS_TOAST_MESSAGE: Partial<Record<SensorConnectionProcessStatus, string>> = {
    idle: '',
    error: 'Something went wrong',

    checkingBle: 'Check BLE permissions and connection status...',
    discovering: 'Discover for devices... Found: ${count} devices',
    pairingDiscovedDevice: 'Pairing device...',
    pairingSuccess: 'Paring was a success',
};
