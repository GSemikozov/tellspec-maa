import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../api";

import type { IDonor, IDonorAllRequestData } from "./donors.types";

const api = new API();

export const fetchDonors = createAsyncThunk(
  "donors/fetch",
  async (data: IDonorAllRequestData): Promise<IDonor[]> => {
    const { completeData, showArchived } = data;

    try {
      return await api.donors.getAllDonors(completeData, showArchived);
    } catch (error) {
      console.error(error);
      throw new Error("Can't fetch donors list. Try again later");
    }
  }
);
