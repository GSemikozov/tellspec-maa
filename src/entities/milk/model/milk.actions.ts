import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';

import type { Milk } from '@entities/milk';

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

export const fetchMilkById = createAsyncThunk(
    'milk/fetch-by-id',
    async (id: string): Promise<Milk> => {
        try {
            const milksResponse = await apiInstance.milk.getMilkById(id);

            if (milksResponse === null) {
                throw new Error('empty response');
            }

            return milksResponse;
        } catch (error) {
            console.error(error);
            throw new Error("Can't fetch milks list. Try again later");
        }
    },
);

export const fetchMilksByIds = createAsyncThunk(
    'milk/fetch-by-ids',
    async (ids: string[]): Promise<Milk[]> => {
        try {
            const milksResponse = await apiInstance.milk.getMilksByIds(ids);

            if (milksResponse === null) {
                throw new Error('empty response');
            }

            return milksResponse;
        } catch (error) {
            console.error(error);
            throw new Error("Can't fetch milks list. Try again later");
        }
    },
);
