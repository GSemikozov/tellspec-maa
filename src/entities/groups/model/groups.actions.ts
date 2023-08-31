import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../api";

import type { IGroup, IGetGroupsRequest } from "./groups.types";

const api = new API();

export const fetchGroup = createAsyncThunk(
  "groups/fetch",
  async (data: IGetGroupsRequest): Promise<IGroup> => {
    try {
      return await api.groups.fetchGroup(data);
    } catch (error) {
      console.error(error);
      throw new Error("Can't fetch donors list. Try again later");
    }
  }
);
