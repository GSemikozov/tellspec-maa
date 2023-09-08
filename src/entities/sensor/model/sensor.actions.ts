import { createAsyncThunk } from '@reduxjs/toolkit';

import { DEVICE_PAIR_STORAGE_KEY } from '../sensor.constants';

// import type { BleDeviceInfo } from 'tellspec-sensor-sdk/src/definitions';

const store = new Storage();

export const getPairDevice = createAsyncThunk('sensor/connect', async (): Promise<any> => {
    await store.create();
    const storageKey = await store.get(DEVICE_PAIR_STORAGE_KEY);

    if (storageKey) {
        return storageKey;
    } else {
        throw new Error('No device found');
    }
});
