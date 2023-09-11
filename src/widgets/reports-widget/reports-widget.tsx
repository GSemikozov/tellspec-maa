import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonCheckbox, IonCol, IonRow } from "@ionic/react";

import { DateRange } from "@ui/date-range";

import { reportsAsyncActions, reportsSelectors } from "../../entities/reports";

import { ReportTable } from "./report-table";
import { ActionsPanel } from "./actions-panel";

import type { AppDispatch } from "@app";

export const ReportsWidget: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [from, setFrom] = useState<string>();
    const [to, setTo] = useState<string>();
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const data = useSelector(reportsSelectors.selectReportsByDate(from, to))

    useEffect(() => {
        dispatch(reportsAsyncActions.fetchReport({
            last_modified_gte: from,
            last_modified_lte: to,
        }));
    }, [from, to]);

    const handleDateRangeChange = (name: string, value: string) => {
        if (name === 'from') {
            setFrom(value);
        } else {
            setTo(value);
        }
    }

    return (
        <>
            <IonRow className="ion-align-items-center">
                <IonCol>
                    <h1>View Reports</h1>
                    <IonCheckbox
                        value={selectAll}
                        onIonChange={() => setSelectAll(!selectAll)}
                    >
                        Select All
                    </IonCheckbox>
                </IonCol>

                <IonCol>
                    <DateRange from={from} to={to} onChange={handleDateRangeChange}/>
                </IonCol>
            </IonRow>

            <IonRow>
                <ReportTable data={data}/>
            </IonRow>

            <ActionsPanel />
        </>
    )
}