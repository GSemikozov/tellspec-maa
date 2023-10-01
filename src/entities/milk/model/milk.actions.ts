import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiInstance } from '@api/network';

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
