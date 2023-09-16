import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonLabel, IonSegment, IonSegmentButton, useIonRouter } from '@ionic/react';

import { BarcodeScanner } from '@ui';
import { AnalyseMilkIcon } from '@ui/icons';
import { apiInstance } from '@api/network';
import { useEventAsync } from '@shared/hooks';
import { classname } from '@shared/utils';
import { usePreemieToast, PageArea } from '@shared/ui';
import { selectUserEmail } from '@entities/user/model/user.selectors';
import { CalibrationType, fetchScan, runSensorScan } from '@entities/sensor';
import { fetchReport, selectIsReportLoading, selectReportByMilkId } from '@entities/reports';
import { fetchMilks, selectIsMilkLoading, selectMilkList } from '@entities/milk';
import { SpectrumAnalyse } from '@widgets/spectrum-analyse';
import { TestResults } from '@widgets/test-results';

import { ActionsPanel } from './actions-panel';

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
    const [activeTab, setActiveTab] = React.useState<AnalyseWidgetTabs>(AnalyseWidgetTabs.SPECTRUM);
    const [analyseMilkLoading, setAnalyseMilkLoading] = React.useState(false);

    const [, setModelScannedData] = React.useState<any>(null);

    const userEmail = useSelector(selectUserEmail);

    const milksLoading = useSelector(selectIsMilkLoading);
    const milkList = useSelector(selectMilkList);

    const reportMilkLoading = useSelector(selectIsReportLoading);
    const reportMilk = useSelector(state => selectReportByMilkId(state, milkId));

    const retrieveReport = React.useCallback(async (newMilkId: string) => {
        try {
            const reports = await dispatch(fetchReport({ milk_id: newMilkId })).unwrap();

            if (!reports || reports.length === 0) {
                throw new Error('Unabled to find milk information');
            }

            return reports[0];
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error.message,
            });
        }
    }, []);

    const retrieveScan = React.useCallback(async (scanId: string) => {
        try {
            const scanData = await dispatch(fetchScan(scanId)).unwrap();

            if (!scanData) {
                throw new Error('Unabled to find scan information');
            }

            return scanData;
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error.message,
            });
        }
    }, []);

    const handleChangeMilkId = useEventAsync(async (milkId: string) => {
        setMilkId(milkId);

        const report = await retrieveReport(milkId);

        if (report && report.data.analyseData) {
            await retrieveScan(report.data.analyseData.scanId);
        }
    });

    const handleAnalyseMilk = useEventAsync(async () => {
        try {
            setAnalyseMilkLoading(true);

            await presentToast({
                message: 'Start analyse...',
            });

            if (!reportMilk) {
                throw new Error('Missing milk report');
            }

            const newSensorScanData = await dispatch(runSensorScan(userEmail)).unwrap();

            if (!newSensorScanData || !newSensorScanData.uuid || !newSensorScanData.absorbance) {
                throw new Error('An error occured on analyse milk');
            }

            const scanId = newSensorScanData.uuid;

            const modelData = await apiInstance.sensor.runModel({
                scans: [scanId],
                average: false,
                'calib-to-use': CalibrationType.FACTORY,
            });

            setModelScannedData(modelData);

            const shallowReportAnalysedData: any = {
                ...reportMilk,
                data: {
                    ...reportMilk.data,
                    analyseData: {
                        scanId: scanId,
                        result: modelData,
                    },
                },
            };

            await apiInstance.reports.updateReport(shallowReportAnalysedData);

            await retrieveReport(milkId);

            if (activeTab === AnalyseWidgetTabs.SPECTRUM) {
                await presentToast({
                    type: 'success',
                    message:
                        'Milk was successfully analysed! You can see the result on the tab "Test Results"',
                });
            }
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error.message,
            });
        } finally {
            setAnalyseMilkLoading(false);
        }
    });

    const handleChangeTab = (event: IonSegmentCustomEvent<SegmentChangeEventDetail>) => {
        setActiveTab(event.target.value as AnalyseWidgetTabs);
    };

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

    React.useEffect(() => {
        dispatch(fetchMilks());
    }, []);

    const milkOptions = React.useMemo(
        () =>
            milkList.map(milk => ({
                value: milk.milk_id,
                title: milk.milk_id,
            })),
        [milkList],
    );

    const activeTabComponent = React.useMemo(() => {
        if (reportMilkLoading) {
            return <div className={cn('tab-placeholder')}>Try to loading milk information...</div>;
        }

        if (!milkId) {
            return (
                <div className={cn('tab-placeholder')}>Scan or enter the milk barcode first</div>
            );
        }

        if (activeTab === AnalyseWidgetTabs.SPECTRUM) {
            return <SpectrumAnalyse milkId={milkId} analyseMilkLoading={analyseMilkLoading} />;
        }

        if (activeTab === AnalyseWidgetTabs.TEST_RESULTS) {
            return <TestResults reportMilk={reportMilk} />;
        }

        return null;
    }, [activeTab, milkId, reportMilkLoading, reportMilk, analyseMilkLoading]);

    const hasMilkId = milkId !== '';

    const showOnlyAnalyseButton = !reportMilk?.data.analyseData;

    return (
        <PageArea>
            <PageArea.Header
                title='Analyse Milk'
                icon={<AnalyseMilkIcon />}
                actions={
                    <div className={cn('header-scanner')}>
                        <BarcodeScanner
                            title='Select, Scan or Enter Milk ID'
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
                        <IonSegmentButton value={AnalyseWidgetTabs.SPECTRUM}>
                            <IonLabel>Spectrum</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value={AnalyseWidgetTabs.TEST_RESULTS}>
                            <IonLabel>Test Results</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    <div className={cn('tab')}>{activeTabComponent}</div>

                    {hasMilkId ? (
                        <div className={cn('actions-panel')}>
                            <ActionsPanel
                                showOnlyAnalyse={showOnlyAnalyseButton}
                                analyseMilkLoading={analyseMilkLoading}
                                onAnalyseMilk={handleAnalyseMilk}
                            />
                        </div>
                    ) : null}
                </div>
            </PageArea.Main>
        </PageArea>
    );
};
