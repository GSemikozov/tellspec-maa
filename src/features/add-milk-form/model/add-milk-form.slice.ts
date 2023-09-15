import { createSlice } from '@reduxjs/toolkit';

import { addMilk } from './add-milk-form.actions';

interface InitialState {
    status: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: InitialState = {
    status: 'idle',
};

export const addMilkFormSlice = createSlice({
    name: 'addMilkForm',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(addMilk.fulfilled, state => {
            state.status = 'success';
        });
        builder.addCase(addMilk.pending, state => {
            state.status = 'loading';
        });
        builder.addCase(addMilk.rejected, state => {
            state.status = 'error';
        });
    },
});

export const addMilkFormActions = addMilkFormSlice.actions;

export const addMilkFormReducer = addMilkFormSlice.reducer;
