import { createAsyncThunk } from '@reduxjs/toolkit';
import { endOfDay, isBefore, startOfDay } from 'date-fns';

import { apiInstance } from '@api/network';
import { clearStorageData, getStorageData } from '@app/app.utils';
import { RootState } from '@app/store';
import { NativeStorageKeys, nativeStore, retrieveBlePermissions } from '@api/native';

type State = RootState | null;

export const fetchAppSettings = createAsyncThunk('app/fetching', async (): Promise<State> => {
    const storageState = await getStorageData();

    if (storageState) {
        const checkTokenResponse = await apiInstance.users.checkToken();

        if (checkTokenResponse.error?.code) {
            await clearStorageData();
            window.location.replace('/login');
            return null;
        }

        return storageState;
    }

    return null;
});

export const fetchBleStatus = createAsyncThunk(
    'app/fetch-ble-status',
    async (): Promise<boolean> => {
        const hasPermissions = await retrieveBlePermissions();

        console.log('[fetchBleStatus]', hasPermissions);

        return hasPermissions;
    },
);

export const updatePreventInstructions = createAsyncThunk(
    'app/updatePreventInstructions',
    async () => {
        const preventInstructions = await nativeStore.get(
            NativeStorageKeys.PREVENT_SENSOR_ANALYSE_INSTRUCTIONS_MODAL,
        );

        if (!preventInstructions) {
            return;
        }

        const preventInstructionsDate = preventInstructions.timestamps;
        const now = new Date();

        if (isBefore(endOfDay(preventInstructionsDate), startOfDay(now))) {
            nativeStore.set(NativeStorageKeys.PREVENT_SENSOR_ANALYSE_INSTRUCTIONS_MODAL, {
                value: false,
                timestamps: +now,
            });
        }
    },
);

export const updateIsFirstSensorCalibration = createAsyncThunk(
    'app/updateIsFirstSensorCalibration',
    async () => {
        const isFirstSensorCalibration = await nativeStore.get(
            NativeStorageKeys.IS_FIRST_SENSOR_CALIBRATION,
        );

        const now = new Date();

        if (!isFirstSensorCalibration) {
            await nativeStore.set(NativeStorageKeys.IS_FIRST_SENSOR_CALIBRATION, {
                value: true,
                timestamps: +now,
            });

            return;
        }

        const isFirstSensorCalibrationDate = isFirstSensorCalibration.timestamps;

        if (isBefore(endOfDay(isFirstSensorCalibrationDate), startOfDay(now))) {
            nativeStore.set(NativeStorageKeys.IS_FIRST_SENSOR_CALIBRATION, {
                value: true,
                timestamps: +now,
            });
        }
    },
);

export const updateIsFirstWarmup = createAsyncThunk('app/updateIsFirstWarmup', async () => {
    const isFirstWarmup = await nativeStore.get(NativeStorageKeys.IS_FIRST_WARMUP);

    if (typeof isFirstWarmup !== 'boolean') {
        await nativeStore.set(NativeStorageKeys.IS_FIRST_WARMUP, true);

        return;
    }
});
