import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../api";

import type { IReport, IReportRequestParam } from "./reports.types";

const api = new API();

export const fetchReport = createAsyncThunk(
    "reports/fetch",
    async (data: IReportRequestParam): Promise<IReport[]> => {
        try {
            return await api.reports.fetchReport(data);
        } catch (error) {
            console.error(error);
            throw new Error("Can't fetch report. Try again later");
        }
    }
);