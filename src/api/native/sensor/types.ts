export enum TellspecSensorEvent {
    LOG = 'log',
    SCANNER_STATUS = 'scannerStatus',
    CONNECTION = 'connectionState',
    SCANNER_RESULT = 'ScannerResult',
    INIT = 'Initialize',
    SCANER_INFO = 'scannerInfoPromise',
    CONFIG = 'Configs',
    DEVICE_INFO = 'DeviceInfo',
    DEVICE_LIST = 'updateDeviceList',
}

export type TellspecBaseResponseStatus = 'ok' | 'error';

export type TellspecSensorBaseResponseSuccess<R = unknown> = {
    status: 'ok';
} & R;

export type TellspecSensorBaseResponseFail = {
    status: 'error';
    message: string;
};

export type TellspecSensorBaseResponse =
    | TellspecSensorBaseResponseSuccess
    | TellspecSensorBaseResponseFail;
