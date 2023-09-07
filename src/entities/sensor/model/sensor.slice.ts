import { createSlice } from '@reduxjs/toolkit';

import { SensorState, CalibrationType } from './sensor.types';

const initialState: SensorState = {
    status: CalibrationType.DISCONNECTED,
};

export const sensorSlice = createSlice({
    name: 'sensor',
    initialState,
    reducers: {},
    extraReducers: () => {},
});

export const sensorActions = sensorSlice.actions;

export const sensorReducer = sensorSlice.reducer;
