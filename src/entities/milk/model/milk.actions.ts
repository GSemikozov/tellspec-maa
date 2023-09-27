import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@app';
import { apiInstance } from '@api/network';
import { tellspecRunScan } from '@api/native';
import { GetCalibrationResponse } from '@entities/sensor';

export const fetchMilks = createAsyncThunk('milks/fetch-list', async () => {
    try {
        const milksResponse = await apiInstance.milk.getMilks();

        if (milksResponse === null) {
            throw new Error('empty response');
        }

        return milksResponse;
    } catch (error) {
        console.error(error);
        throw new Error("Can't fetch donors list. Try again later");
    }
});

export const analyseMilk = createAsyncThunk('milks/analyse-milk', async (_, thunkAPI) => {
    const { user } = thunkAPI.getState() as RootState;

    return tellspecRunScan(user.email, {} as GetCalibrationResponse);
});
