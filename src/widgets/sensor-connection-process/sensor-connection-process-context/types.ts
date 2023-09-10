export enum SensorConnectionProcessStatus {
    IDLE = 'idle',
    ERROR = 'error',

    CHECKING_BLE = 'checkingBle',

    DISCOVERING = 'discovering',
    CHOOSE_DISCOVERED_DEVICE = 'chooseDiscoveredDevice',
    PAIRING_DISCOVERED_DEVICE = 'pairingDiscovedDevice',

    PAIRING_SUCCESS = 'pairingSuccess',
}
