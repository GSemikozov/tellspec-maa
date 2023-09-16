import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

const EMPTY_ARRAY = [];

export const selectGroupSliceState = (state: RootState) => state.groups;

export const selectIsGroupLoading = createSelector(
    [selectGroupSliceState],
    groupSlice => groupSlice.status === 'loading',
);

export const selectGroup = createSelector([selectGroupSliceState], groupSlice => groupSlice.entity);

export const selectGroupFreezers = createSelector(
    [selectGroup],
    group => group?.data?.storage || EMPTY_ARRAY,
);

export const selectGroupCompartmentList = createSelector(
    [selectGroup, (_, id: string) => id],
    (group, id) =>
        group?.data?.storage.find(freezer => freezer.freezer_id === id)?.compartments ||
        EMPTY_ARRAY,
);
