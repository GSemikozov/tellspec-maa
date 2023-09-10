import { Geolocation } from '@capacitor/geolocation';

import { isEmulateNativeSdk } from '@api/native';

const checkBlePermission = async () => {
    const permissionsResponse = await Geolocation.checkPermissions();

    console.log('[checkBlePermission]:', permissionsResponse.coarseLocation);

    return permissionsResponse.coarseLocation === 'granted';
};

const requestBlePermissions = async () => {
    const permissionsResponse = await Geolocation.requestPermissions({
        permissions: ['coarseLocation'],
    });

    return permissionsResponse.coarseLocation;
};

export const retrieveBlePermissions = async (): Promise<boolean> => {
    if (await isEmulateNativeSdk()) {
        const emulateResponse = true;

        console.log('[retrieveBlePermissions/emulate]:', emulateResponse);
        return emulateResponse;
    }

    try {
        const hasBlePermissions = await checkBlePermission();

        if (!hasBlePermissions) {
            const blePermissions = await requestBlePermissions();

            return blePermissions === 'granted';
        }

        return hasBlePermissions;
    } catch (error) {
        console.error('[retrieveBlePermissions]', error);

        return false;
    }
};
