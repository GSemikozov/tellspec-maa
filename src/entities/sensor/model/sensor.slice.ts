import { createSlice } from "@reduxjs/toolkit";

import { CalibrationType } from "./sensor.types";

interface SensorState {
    status: CalibrationType;
}

const initialState: SensorState = {
    status: CalibrationType.DISCONNECTED,
};

export const sensorSlice = createSlice({
    name: "sensor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {},
});

export const sensorActions = sensorSlice.actions;

export const sensorReducer = sensorSlice.reducer;