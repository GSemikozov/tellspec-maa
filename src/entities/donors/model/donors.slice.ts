import { createSlice } from "@reduxjs/toolkit";
import { fetchDonors } from "./donors.actions";

import type { IDonor } from "./donors.types";

interface DonorsState {
  status: "idle" | "loading" | "success" | "error";
  entities: IDonor[];
}

const initialState: DonorsState = {
  status: "idle",
  entities: [],
};

export const donorsSlice = createSlice({
  name: "donors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDonors.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchDonors.fulfilled, (state, action) => {
      state.status = "success";
      state.entities = [...action.payload];
    });
    builder.addCase(fetchDonors.rejected, (state) => {
      state.status = "error";
    });
  },
});

export const donorsActions = donorsSlice.actions;

export const donorsReducer = donorsSlice.reducer;
