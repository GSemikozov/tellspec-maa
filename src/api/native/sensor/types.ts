import type {
    EventUpdateDeviceListType,
    BleDeviceInfo,
    ScanResultType,
} from 'tellspec-sensor-sdk/src/definitions';

export namespace TellspecListenerEvents {
    export type UpdateDeviceList = EventUpdateDeviceListType;
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

export type TellspecSensorDevice = BleDeviceInfo;

export type TellspecRawSensorScannedData = ScanResultType;
export type TellspecSensorScannedData = Omit<
    ScanResultType,
    'uuid' | 'wavelengths' | 'absorbance' | 'ReferenceIntensity' | 'Intensity'
> & {
    uuid: string;
    wavelengths: number[];
    absorbance: number[];
    ReferenceIntensity: number[];
    Intensity: number[];
};
