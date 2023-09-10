export enum BleStatus {
    ON = 'on',
    OFF = 'off',
}

export type BleState = {
    status: BleStatus;
};

export type LayoutSettings = {
    isSidebarVisible: boolean;
};

interface IAlertSettings {
    isAlertVisible: boolean;
    alertHeader: string;
    alertSubHeader?: string;
    alertMessage?: string;
}

interface IBackdropSettings {
    isBackdropVisible: boolean;
    backdropText: string;
    delay: number;
}

export interface IAlertActionPayload {
    alertHeader: string;
    alertSubHeader?: string;
    alertMessage?: string;
}

export interface IBackdropPayload {
    backdropText: string;
    delay?: number;
}

export interface IApp {
    status: 'idle' | 'loading' | 'success' | 'error';
    online: boolean;
    ble: BleState;
    layout: LayoutSettings;
    alert: IAlertSettings;
    backdrop: IBackdropSettings;
}
