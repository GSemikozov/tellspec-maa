import { createSlice } from '@reduxjs/toolkit';

import { fetchGroup } from './groups.actions';

import type { IGroup } from './groups.types';

interface GroupState {
    status: 'idle' | 'loading' | 'success' | 'error';
    entity: IGroup | null;
}

const initialState: GroupState = {
    status: 'idle',
    entity: null,
};

export const groupsSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchGroup.pending, state => {
            state.status = 'loading';
        });
        builder.addCase(fetchGroup.fulfilled, (state, action) => {
            state.status = 'success';
            state.entity = action.payload;
        });
        builder.addCase(fetchGroup.rejected, state => {
            state.status = 'error';
        });
    },
});

export const groupsActions = groupsSlice.actions;

export const groupsReducer = groupsSlice.reducer;
