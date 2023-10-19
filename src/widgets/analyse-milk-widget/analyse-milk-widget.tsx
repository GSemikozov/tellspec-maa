import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonLabel, IonSegment, IonSegmentButton, useIonRouter } from '@ionic/react';

import { usePreemieToast, BarcodeScanner } from '@ui';
import { AnalyseMilkIcon } from '@ui/icons';
import { useEventAsync } from '@shared/hooks';
import { classname } from '@shared/utils';
import { PageArea } from '@shared/ui';
import { selectUserEmail } from '@entities/user/model/user.selectors';
import { useRunScanSensor } from '@entities/sensor';
import { extractReportAnalyseData } from '@entities/reports';
import { fetchMilks, selectIsMilkLoading, selectMilkList } from '@entities/milk';
import { SpectrumAnalyse } from '@widgets/spectrum-analyse';
import { TestResults } from '@widgets/test-results';
import { appActions } from '@app';

import { ActionsPanel } from './actions-panel';
import { useAnalyseMilkReport, useAnalyseMilkSpectrumScan } from './hooks';

import type { IonSegmentCustomEvent, SegmentChangeEventDetail } from '@ionic/core';
import type { AppDispatch } from '@app/store';

import './analyse-milk-widget.css';

const cn = classname('analyse-milk-widget');

enum AnalyseWidgetTabs {
    SPECTRUM = 'spectrum',
    TEST_RESULTS = 'testResults',
}

export const AnalyseMilkWidget: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { routeInfo } = useIonRouter();
    const [presentToast] = usePreemieToast();

    const [milkId, setMilkId] = React.useState<string>('');
    const [activeTab, setActiveTab] = React.useState<AnalyseWidgetTabs>(
        AnalyseWidgetTabs.TEST_RESULTS,
    );

    const [, setModelScannedData] = React.useState<any>(null);

    const [fetchSpectrumScan, onSetSpectrumScan, { spectrumScan, loading: spectrumScanLoading }] =
        useAnalyseMilkSpectrumScan();

    const [lazyFetchReport, onSetReport, { report: reportMilk, loading: reportLoading }] =
        useAnalyseMilkReport({
            onComplete: async reportData => {
                const analyseData = extractReportAnalyseData(reportData);

                if (!analyseData) {
                    return;
                }

                fetchSpectrumScan(analyseData.scanId);
            },
        });

    const [call, { scanValidationResultComponent, loading: analyseMilkLoading }] = useRunScanSensor(
        {
            onComplete: async runScanSensorData => {
                const { newReport, newModelData, newSensorScanData } = runScanSensorData;

                setModelScannedData(newModelData);

                onSetReport(newReport);
                onSetSpectrumScan(newSensorScanData);

                if (activeTab === AnalyseWidgetTabs.SPECTRUM) {
                    await presentToast({
                        type: 'success',
                        message:
                            'Milk was successfully analysed! You can see the result on the tab "Test Results"',
                    });
                }
            },
        },
    );

    const userEmail = useSelector(selectUserEmail);

    const milksLoading = useSelector(selectIsMilkLoading);
    const milkList = useSelector(selectMilkList);

    const handleChangeMilkId = useEventAsync(async (milkId: string) => {
        onSetReport(null);
        onSetSpectrumScan(null);

        setMilkId(milkId);
        lazyFetchReport({ milk_id: milkId });
    });

    const handleAnalyseMilk = React.useCallback(async () => {
        await call(reportMilk, userEmail);
    }, [call, reportMilk, userEmail]);

    const handleChangeTab = (event: IonSegmentCustomEvent<SegmentChangeEventDetail>) => {
        setActiveTab(event.target.value as AnalyseWidgetTabs);
    };

    React.useEffect(() => {
        dispatch(appActions.showSidebar());
        dispatch(fetchMilks());
    }, []);

    React.useEffect(() => {
        if (milksLoading) {
            return;
        }

        const query = new URLSearchParams(routeInfo.search);
        const milkId = query.get('milkId');

        if (!milkId) {
            return;
        }

        handleChangeMilkId(milkId);
    }, [routeInfo, milksLoading, handleChangeMilkId]);

    const activeTabComponent = React.useMemo(() => {
        if (!milkId) {
            return <div className={cn('tab-placeholder')}>Please select or scan the milk ID</div>;
        }

        if (reportLoading) {
            return <div className={cn('tab-placeholder')}>Try to loading milk information...</div>;
        }

        if (analyseMilkLoading) {
            return <div className={cn('tab-placeholder')}>Analyse loading...</div>;
        }

        if (activeTab === AnalyseWidgetTabs.SPECTRUM) {
            return (
                <SpectrumAnalyse
                    spectrumScan={spectrumScan}
                    spectrumScanLoading={spectrumScanLoading}
                />
            );
        }

        if (activeTab === AnalyseWidgetTabs.TEST_RESULTS) {
            return <TestResults reportMilk={reportMilk} />;
        }

        return null;
    }, [activeTab, milkId, reportMilk, reportLoading, analyseMilkLoading, spectrumScanLoading]);

    const milkOptions = React.useMemo(
        () =>
            milkList.map(milk => ({
                value: milk.milk_id,
                title: milk.milk_id,
            })),
        [milkList],
    );

    const hasMilkId = milkId !== '';

    const showActions = hasMilkId; // && connectedSensor !== null;
    const showOnlyAnalyseButton = extractReportAnalyseData(reportMilk) === null;

    return (
        <PageArea>
            <PageArea.Header
                title='Analyse Milk'
                icon={<AnalyseMilkIcon />}
                actions={
                    <div className={cn('header-scanner')}>
                        <BarcodeScanner
                            title='Select or Scan Milk ID'
                            options={milkOptions}
                            value={milkId}
                            disabled={milksLoading}
                            onChange={handleChangeMilkId}
                        />
                    </div>
                }
            />

            <PageArea.Main>
                <div className={cn('tabs')}>
                    <IonSegment
                        value={activeTab}
                        disabled={!hasMilkId}
                        onIonChange={handleChangeTab}
                    >
                        <IonSegmentButton value={AnalyseWidgetTabs.TEST_RESULTS}>
                            <IonLabel>Test Results</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value={AnalyseWidgetTabs.SPECTRUM}>
                            <IonLabel>Spectrum</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    <div className={cn('tab')}>{activeTabComponent}</div>

                    {showActions && reportMilk ? (
                        <div className={cn('actions-panel')}>
                            <ActionsPanel
                                showOnlyAnalyse={showOnlyAnalyseButton}
                                analyseMilkLoading={analyseMilkLoading}
                                onAnalyseMilk={handleAnalyseMilk}
                                selectedID={milkId}
                                isMilkAnalysed={!!reportMilk.data.analyseData}
                            />
                        </div>
                    ) : null}
                </div>

                {scanValidationResultComponent}
            </PageArea.Main>
        </PageArea>
    );
};
