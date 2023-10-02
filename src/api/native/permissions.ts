import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Filesystem } from '@capacitor/filesystem';

import { isEmulateNativeSdk } from '@api/native';

const PERMISSIONS = {
    BLUETOOTH_CONNECT: 'android.permission.BLUETOOTH_CONNECT',
    BLUETOOTH_SCAN: 'android.permission.BLUETOOTH_SCAN',
    ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
};

const checkBlePermission = async () => {
    const bluetoothConnectPermission = await AndroidPermissions.checkPermission(
        PERMISSIONS.BLUETOOTH_CONNECT,
    );

    const bluetoothScanPermission = await AndroidPermissions.checkPermission(
        PERMISSIONS.BLUETOOTH_SCAN,
    );

    const locationPermission = await AndroidPermissions.checkPermission(
        PERMISSIONS.ACCESS_COARSE_LOCATION,
    );

    return (
        bluetoothConnectPermission.hasPermission &&
        bluetoothScanPermission.hasPermission &&
        locationPermission.hasPermission
    );
};

const requestBlePermissions = async () => {
    const permissionsResponse = await AndroidPermissions.requestPermissions([
        PERMISSIONS.BLUETOOTH_CONNECT,
        PERMISSIONS.BLUETOOTH_SCAN,
    ]);

    return permissionsResponse.hasPermission;
};

export const retrieveBlePermissions = async (): Promise<boolean> => {
    if (await isEmulateNativeSdk()) {
        const emulateResponse = true;

        console.log('[retrieveBlePermissions/emulate]:', emulateResponse);
        return emulateResponse;
    }

    try {
        let hasBlePermissions = await checkBlePermission();

        if (!hasBlePermissions) {
            hasBlePermissions = await requestBlePermissions();
        }

        return hasBlePermissions;
    } catch (error) {
        console.error('[retrieveBlePermissions]', error);

        return false;
    }
};

export const retrieveFilesystemPermissions = async (): Promise<boolean> => {
    if (await isEmulateNativeSdk()) {
        const emulateResponse = true;

        console.log('[retrieveFilesystemPermissions/emulate]:', emulateResponse);
        return emulateResponse;
    }

    try {
        let hasPermission = await Filesystem.checkPermissions();

        if (hasPermission.publicStorage !== 'granted') {
            hasPermission = await Filesystem.requestPermissions();
        }

        return hasPermission.publicStorage === 'granted';
    } catch (error) {
        console.error('[retrieveFilesystemPermissions]', error);

        return false;
    }
};
