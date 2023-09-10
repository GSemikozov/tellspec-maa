import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonLabel, IonRow, IonSegment, IonSegmentButton, IonText } from '@ionic/react';

import { BarcodeScanner } from '@ui';
import { SpectrumAnalyse } from '@widgets/spectrum-analyse';
import { TestResults } from '@widgets/test-results';
import { reportsSelectors, reportsAsyncActions } from '@entities/reports';

import AnalyseIcon from '../../../assets/images/analyse-milk-selected.png';

import type { AppDispatch } from '@app/store';

import './analyse-milk-widget.css';

enum Tabs {
    'spectrum',
    'results',
}

export const AnalyseMilkWidget: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.spectrum);
    const [milkId, setMilkId] = useState<string>();

    const report = useSelector(reportsSelectors.selectReportByMilkId(milkId!));
    const ActiveTabComponent = activeTab === Tabs.spectrum ? SpectrumAnalyse : TestResults;

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
            <div className='analyse-wrapper'>
                <div className='analyse-header'>
                    <h2>
                        <IonText>
                            <img src={AnalyseIcon} /> Analyse Milk
                        </IonText>
                    </h2>

                    <div className='milk-id-scanner'>
                        <BarcodeScanner
                            title='Select, Scan or Enter Milk ID'
                            value={milkId}
                            onChange={setMilkId}
                        />
                    </div>
                </div>

                <div className='analyse-tabs'>
                    <IonRow class='ion-justify-content-start'>
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
                    </IonRow>

                    <IonRow class='ion-justify-content-around'>
                        <div className='analyse-tabs__content'>
                            {milkId ? (
                                // @ts-ignore // TODO: milk_id?
                                <ActiveTabComponent milkID={milkId} report={report} />
                            ) : (
                                <div className='analyse-tabs__content-placeholder'>
                                    Scan or enter the milk barcode first
                                </div>
                            )}
                        </div>
                    </IonRow>
                </div>
            </div>
        </>
    );
};
