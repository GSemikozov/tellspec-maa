import type { PermissionState } from '@capacitor/core';

export type LayoutSettings = {
    isSidebarVisible: boolean;
};

export enum BluetoothStatus {
    OFF = 'off',
    ON = 'on',
}

export type BluetoothPermission = PermissionState;

export type BluetoothSettings = {
    status: BluetoothStatus;
    permission: BluetoothPermission;
};

export interface IApp {
    status: 'idle' | 'loading' | 'success' | 'error';
    online: boolean;
    bluetooth: BluetoothSettings;
    layout: LayoutSettings;
}
