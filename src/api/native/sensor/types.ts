import type { EventUpdateDeviceListType, BleDeviceInfo } from 'tellspec-sensor-sdk/src/definitions';

export namespace TellspecListenerEvents {
    export type UpdateDeviceList = EventUpdateDeviceListType;
}

export type TellspecSensorDevice = BleDeviceInfo;

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
