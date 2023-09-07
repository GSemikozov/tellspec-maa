import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonLabel, IonRow, IonSegment, IonSegmentButton } from '@ionic/react';

// import { TestResults } from "../test-results";
import { BarcodeScanner } from '@ui';
import { reportsAsyncActions, reportsSelectors } from '@entities/reports';
import { SpectrumAnalyse } from '@widgets/spectrum-analyse';

import type { AppDispatch } from '@app/store';

enum Tabs {
    'spectrum',
    'results',
}

export const AnalyseMilkWidget: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.spectrum);
    const [milkId, setMilkId] = useState<string>();

    const analyseData = useSelector(reportsSelectors.selectReportByMilkId(milkId!));

    useEffect(() => {
        if (!milkId) {
            return;
        }

        dispatch(reportsAsyncActions.fetchReport({ milk_id: milkId }));
    }, [milkId]);

    return (
        <>
            <h2>analyse</h2>
            <BarcodeScanner
                title='Please select, scan or enter Milk ID'
                onChange={setMilkId}
                value={milkId}
            />

            <div>
                <IonRow>
                    <IonSegment
                        value={activeTab}
                        disabled={!milkId}
                        onIonChange={e => setActiveTab(e.target.value as Tabs)}
                    >
                        <IonSegmentButton value={Tabs.spectrum}>
                            <IonLabel>Spectrum</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value={Tabs.results}>
                            <IonLabel>Test Results</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    {activeTab === Tabs.spectrum ? (
                        <SpectrumAnalyse analyseData={analyseData!} />
                    ) : (
                        <div>Test results</div>
                    )}

                    {!milkId ? <div>Scan the milk barcode first</div> : null}
                </IonRow>
            </div>
        </>
    );
};
