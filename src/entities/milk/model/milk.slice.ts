import { createSlice } from '@reduxjs/toolkit';

import { fetchMilks } from './milk.actions';

import type { MilkSliceState } from './milk.types';

const initialState: MilkSliceState = {
    status: 'idle',
    byIds: {},
};

export const milkSlice = createSlice({
    name: 'milk',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchMilks.pending, state => {
            state.status = 'loading';
        });
        builder.addCase(fetchMilks.fulfilled, (state, action) => {
            state.status = 'success';

            state.byIds = action.payload.reduce((carry, milk) => {
                carry[milk.milk_id] = milk;

                return carry;
            }, {});
        });
        builder.addCase(fetchMilks.rejected, state => {
            state.status = 'error';
        });
    },
});

export const milkActions = milkSlice.actions;

export const milkReducer = milkSlice.reducer;
