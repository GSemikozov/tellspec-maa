import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    IonContent,
    IonRow,
    IonCol,
    IonCheckbox,
} from '@ionic/react';

import { DateRange } from "@ui/date-range";
import {Layout} from "@widgets/layout";
import ReportsIcon from '../../../assets/images/view-reports-selected.png'

import { reportsAsyncActions, reportsSelectors } from "../../entities/reports";

import { ReportTable } from "./report-table";

import type { AppDispatch } from "@app";

import './reports.page.css'

export const ReportsPage: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector(reportsSelectors.selectAllReports)
    const [from, setFrom] = useState<string>();
    const [to, setTo] = useState<string>();
    const [selectAll, setSelectAll] = useState<boolean>(false);

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
        <Layout>
            <IonContent className='ion-padding'>
                <IonRow className="ion-align-items-center">
                    <IonCol>
                        <h1><img src={ReportsIcon} id="reports-icon"/>View Reports</h1>
                        <IonCheckbox
                            value={selectAll}
                            onIonChange={() => setSelectAll(!selectAll)}
                        >
                            Select All
                        </IonCheckbox>
                    </IonCol>

                    <IonCol>
                        <DateRange from={from} to={to} onChange={handleDateRangeChange} />
                    </IonCol>
                </IonRow>

                <IonRow>
                    <ReportTable data={data} />
                </IonRow>
            </IonContent>
        </Layout>
    );
};
