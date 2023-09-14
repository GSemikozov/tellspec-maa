import type { RootState } from '@app/store';

export const selectIsAddMilkFormLoading = (state: RootState) =>
    state.addMilkForm.status === 'loading';
