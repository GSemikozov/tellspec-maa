import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app';

import type { Milk } from '@entities/milk';

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

export const selectMilkByIds = createSelector(
    [selectMilkSliceState, (_, milkIds: string) => milkIds],
    (milkState, milkIds) => {
        const idsArray = milkIds.split(',');
        return Object.entries(milkState.byIds).reduce((previousValue: Milk[], currentValue) => {
            const [key, value] = currentValue;

            if (idsArray.indexOf(key) !== -1) {
                return [...previousValue, value];
            }

            return previousValue;
        }, []);
    },
);
