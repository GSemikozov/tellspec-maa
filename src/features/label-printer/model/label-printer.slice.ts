import { createSlice } from '@reduxjs/toolkit';

import { pairPrinter } from './label-printer.actions';

interface InitialState {
    status: 'idle' | 'pairing' | 'paired' | 'error';
}

const initialState: InitialState = {
    status: 'idle',
};

export const labelPrinterSlice = createSlice({
    name: 'labelPrinter',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(pairPrinter.pending, state => {
            state.status = 'pairing';
        });
        builder.addCase(pairPrinter.fulfilled, (state, action) => {
            state.status = 'paired';
            console.log('pairPrinter action', action);
        });
        builder.addCase(pairPrinter.rejected, state => {
            state.status = 'error';
        });
    },
});

export const labelPrinterActions = labelPrinterSlice.actions;

export const labelPrinterReducer = labelPrinterSlice.reducer;
