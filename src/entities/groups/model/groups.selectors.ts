import { RootState } from "../../../app/store";

export const isGroupsFetching = (state: RootState) =>
  state.groups.status === "loading";
export const getGroup = (state: RootState) => state.groups.entity;
export const getFreezers = (state: RootState) =>
  state.groups.entity?.data?.storage || [];
export const getCompartmentList = (id: string) => (state: RootState) =>
  state.groups.entity?.data?.storage.find(
    (freezer) => freezer.freezer_id === id
  )?.compartments || [];
