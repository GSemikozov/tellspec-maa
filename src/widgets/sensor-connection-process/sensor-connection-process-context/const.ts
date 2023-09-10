import { SensorConnectionProcessStatus } from './types';

export const STATUS_TOAST_MESSAGE: Partial<Record<SensorConnectionProcessStatus, string>> = {
    idle: '',
    checkingBle: 'Check BLE permissions and connection status...',
    discovering: 'Discover for devices... Found: ${count} devices',
    pairingDiscovedDevice: 'Pairing device...',
    pairingSuccess: 'Paring was a success',
};
