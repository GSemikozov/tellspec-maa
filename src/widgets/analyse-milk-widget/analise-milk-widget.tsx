import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { BarcodeScanner } from "../../ui";
import {
    IonLabel,
    IonRow,
    IonSegment,
    IonSegmentButton,
} from "@ionic/react";

import { SpectrumAnalyse } from "../spectrum-analyse";
import { TestResults } from "../test-results";
import { reportsSelectors, reportsAsyncActions } from "../../entities/reports";

import type { AppDispatch } from "../../app/store";

import "./analyse-milk-widget.css";

enum Tabs {
    'spectrum',
    'results',
}

export const AnalyseMilkWidget: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.spectrum)
    const [milkId, setMilkId] = useState<string>();

    const report = useSelector(reportsSelectors.selectReportByMilkId(milkId!));
    const ActiveTabComponent = activeTab === Tabs.spectrum
        ? SpectrumAnalyse
        : TestResults;

    useEffect(() => {
        if (!milkId) {
            return;
        }

        dispatch(reportsAsyncActions.fetchReport({ milk_id: milkId }));
    }, [milkId]);

    useEffect(() => {
        if (!report) return;
        setActiveTab(Tabs.results);
    }, [milkId, report]);

    return (
        <>
            <h2>analyse</h2>
            <BarcodeScanner
                title="Please select, scan or enter Milk ID"
                onChange={setMilkId}
                value={milkId}
            />

            <div>
                <IonRow class="ion-justify-content-start">
                    <IonSegment
                        value={activeTab}
                        disabled={!milkId}
                        onIonChange={(e) => setActiveTab(e.target.value as Tabs)}
                    >
                        <IonSegmentButton value={Tabs.spectrum}>
                            <IonLabel>Spectrum</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value={Tabs.results}>
                            <IonLabel>Test Results</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonRow>

                <IonRow class="ion-justify-content-around">
                    { milkId
                        // @ts-ignore // TODO: milk_id?
                        ? <ActiveTabComponent milkID={milkId} report={report} />
                        : <div className="analyseMilkWidget__placeholder">
                            Scan or enter the milk barcode first
                        </div>
                    }
                </IonRow>
            </div>
        </>
    )
}
