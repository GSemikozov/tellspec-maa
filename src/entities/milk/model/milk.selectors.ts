import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app';

export const selectMilkSliceState = (state: RootState) => state.milk;

export const selectIsMilkLoading = createSelector(
    [selectMilkSliceState],
    milkState => milkState.status === 'loading',
);

export const selectMilkList = createSelector([selectMilkSliceState], milkState =>
    Object.values(milkState.byIds),
);

export const selectMilkById = createSelector(
    [selectMilkSliceState, (_, milkId: string) => milkId],
    (milkState, milkId) => milkState.byIds[milkId],
);
