import type { RootState } from '@app/store';

export const isMilkFormFetching = (state: RootState) => state.addMilkForm.status === 'loading';
