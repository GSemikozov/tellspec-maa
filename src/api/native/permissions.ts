import { Geolocation } from '@capacitor/geolocation';

export const checkBlePermission = async () => {
    const permissionsResponse = await Geolocation.checkPermissions();

    return permissionsResponse.coarseLocation === 'granted';
};

export const requestBlePermissions = async () => {
    const permissionsResponse = await Geolocation.requestPermissions({
        permissions: ['coarseLocation'],
    });

    return permissionsResponse.coarseLocation;
};

export const retrieveBlePermissions = async (): Promise<boolean> => {
    try {
        const hasBlePermissions = await checkBlePermission();

        if (!hasBlePermissions) {
            const blePermissions = await requestBlePermissions();

            return blePermissions === 'granted';
        }

        return false;
    } catch (error) {
        console.error('[retrieveBlePermissions]', error);

        return false;
    }
};
