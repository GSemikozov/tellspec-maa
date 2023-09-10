import { AndroidPermissions } from '@ionic-native/android-permissions';

import { isEmulateNativeSdk } from '@api/native';

const PERMISSIONS = {
    BLUETOOTH_CONNECT: 'android.permission.BLUETOOTH_CONNECT',
    BLUETOOTH_SCAN: 'android.permission.BLUETOOTH_SCAN',
};

const checkBlePermission = async () => {
    const bluetoothConnectPermission = await AndroidPermissions.checkPermission(
        PERMISSIONS.BLUETOOTH_CONNECT,
    );

    const bluetoothScanPermission = await AndroidPermissions.checkPermission(
        PERMISSIONS.BLUETOOTH_SCAN,
    );

    console.log(
        `[checkBlePermission]: ${PERMISSIONS.BLUETOOTH_CONNECT}`,
        bluetoothConnectPermission.hasPermission,
    );

    console.log(
        `[checkBlePermission]: ${PERMISSIONS.BLUETOOTH_SCAN}`,
        bluetoothScanPermission.hasPermission,
    );

    return bluetoothConnectPermission.hasPermission && bluetoothScanPermission.hasPermission;
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
