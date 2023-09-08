import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';

import type { IMilk, IMilkList } from '@entities/milk/model/milk.types';

export const addMilk = createAsyncThunk(
    'addMilkForm/fetch',
    async (data: IMilk): Promise<IMilkList> => {
        try {
            const response = await apiInstance.milk.addMilk(data);
            return response;
        } catch (error) {
            console.error(error);
            throw new Error("Can't save milk. Try again later");
        }
    },
);
