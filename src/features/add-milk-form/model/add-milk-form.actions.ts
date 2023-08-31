import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../api";

import type { IMilk, IMilkList } from "../../../entities/milk/model/milk.types";

const api = new API();

export const addMilk = createAsyncThunk(
  "addMilkForm/fetch",
  async (data: IMilk): Promise<IMilkList> => {
    try {
      const response = await api.milk.addMilk(data);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Can't save milk. Try again later");
    }
  }
);
