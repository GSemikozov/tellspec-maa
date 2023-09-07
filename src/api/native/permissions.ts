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
