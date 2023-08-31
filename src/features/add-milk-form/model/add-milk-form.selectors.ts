import type { RootState } from "../../../app/store";

export const isMilkFormFetching = (state: RootState) =>
  // @ts-ignore
  state.addMilkForm.status === "loading";
