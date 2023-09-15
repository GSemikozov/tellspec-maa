import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonLabel, IonSegment, IonSegmentButton, useIonRouter } from '@ionic/react';

import { BarcodeScanner } from '@ui';
import { AnalyseMilkIcon } from '@ui/icons';
import { tellspecRunScan } from '@api/native';
import { apiInstance } from '@api/network';
import { useEventAsync } from '@shared/hooks';
import { classname } from '@shared/utils';
import { usePreemieToast } from '@shared/ui';
import { selectUserEmail } from '@entities/user/model/user.selectors';
import { CalibrationType } from '@entities/sensor';
import { reportsAsyncActions, reportsSelectors } from '@entities/reports';
import { fetchMilks, selectIsMilkLoading, selectMilkList } from '@entities/milk';
import { SpectrumAnalyse } from '@widgets/spectrum-analyse';
import { TestResults } from '@widgets/test-results';

import { ActionsPanel } from './actions-panel';

import type { ScanResultType } from 'tellspec-sensor-sdk/src';
import type { IonSegmentCustomEvent, SegmentChangeEventDetail } from '@ionic/core';
import type { AppDispatch } from '@app/store';
import type { Report } from '@entities/reports';

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

    const [, setModelScannedData] = React.useState<any>(null);
    const [sensorScannedData, setSensorScannedData] = React.useState<ScanResultType | null>(null);
    const [reportAnalysedData, setReportAnalysedData] = React.useState<Report | null>(null);

    const userEmail = useSelector(selectUserEmail);
    const milkList = useSelector(selectMilkList);
    const milksLoading = useSelector(selectIsMilkLoading);
    const reportLoading = useSelector(reportsSelectors.selectIsReportLoading);

    const retrieveReport = useEventAsync(async (newMilkId: string) => {
        try {
            const reports = await dispatch(
                reportsAsyncActions.fetchReport({ milk_id: newMilkId }),
            ).unwrap();

            if (!reports || reports.length === 0) {
                throw new Error('Unabled to find milk information');
            }

            setReportAnalysedData(reports[0]);
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error.message,
            });
        }
    });

    const handleChangeMilkId = React.useCallback(
        async (milkId: string) => {
            setMilkId(milkId);
            setActiveTab(AnalyseWidgetTabs.TEST_RESULTS);

            setSensorScannedData(null);
            setReportAnalysedData(null);

            retrieveReport(milkId);
        },
        [retrieveReport],
    );

    const handleChangeTab = (event: IonSegmentCustomEvent<SegmentChangeEventDetail>) => {
        setActiveTab(event.target.value as AnalyseWidgetTabs);
    };

    const handleAnalyseMilk = useEventAsync(async () => {
        try {
            const newSensorScanData = await tellspecRunScan(userEmail);

            if (!newSensorScanData.uuid || !newSensorScanData.absorbance) {
                throw new Error('an error occured on analyse milk');
            }

            const newSensorScanUuid = newSensorScanData.uuid;

            const modelData = await apiInstance.sensor.runModel({
                scans: [newSensorScanUuid],
                average: false,
                'calib-to-use': CalibrationType.FACTORY,
            });

            setModelScannedData(modelData);

            if (!reportAnalysedData) {
                throw new Error('Missing milk information');
            }

            const shallowReportAnalysedData: any = {
                ...reportAnalysedData,
                data: {
                    ...reportAnalysedData.data,
                    analyseData: {
                        scanId: newSensorScanUuid,
                        result: modelData,
                    },
                },
            };

            await apiInstance.reports.updateReport(shallowReportAnalysedData);
            await retrieveReport(milkId);

            setSensorScannedData(newSensorScanData);

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
        }
    });

    React.useEffect(() => {
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

    const milkOptions = React.useMemo(
        () =>
            milkList.map(milk => ({
                value: milk.milk_id,
                title: milk.milk_id,
            })),
        [milkList],
    );

    const activeTabComponent = React.useMemo(() => {
        if (milksLoading || reportLoading) {
            return <div className={cn('tab-placeholder')}>Loading...</div>;
        }

        if (!milkId) {
            return (
                <div className={cn('tab-placeholder')}>Scan or enter the milk barcode first</div>
            );
        }

        if (activeTab === AnalyseWidgetTabs.SPECTRUM) {
            return (
                <SpectrumAnalyse
                    sensorScannedData={sensorScannedData}
                    onAnalyseMilk={handleAnalyseMilk}
                />
            );
        }

        return <TestResults reportAnalysedData={reportAnalysedData} />;
    }, [
        milksLoading,
        reportLoading,

        milkId,
        activeTab,
        reportAnalysedData,
        sensorScannedData,
        handleAnalyseMilk,
    ]);

    const hasMilkId = milkId !== '';
    const loading = milksLoading || reportLoading;

    const showOnlyAnalyseButton =
        (activeTab === AnalyseWidgetTabs.SPECTRUM && sensorScannedData === null) ||
        (activeTab === AnalyseWidgetTabs.TEST_RESULTS &&
            (!reportAnalysedData || !reportAnalysedData.data.analyseData));

    return (
        <div className={cn()}>
            <div className={cn('header')}>
                <div className={cn('header-title')}>
                    <div className={cn('header-title-icon')}>
                        <AnalyseMilkIcon size={32} color='currentColor' />
                    </div>

                    <div className={cn('header-title-text')}>Analyse Milk</div>
                </div>

                <div className={cn('header-scanner')}>
                    <BarcodeScanner
                        title='Select, Scan or Enter Milk ID'
                        options={milkOptions}
                        value={milkId}
                        onChange={handleChangeMilkId}
                    />
                </div>
            </div>

            <div className={cn('tabs')}>
                <IonSegment value={activeTab} disabled={!hasMilkId} onIonChange={handleChangeTab}>
                    <IonSegmentButton value={AnalyseWidgetTabs.SPECTRUM}>
                        <IonLabel>Spectrum</IonLabel>
                    </IonSegmentButton>

                    <IonSegmentButton value={AnalyseWidgetTabs.TEST_RESULTS}>
                        <IonLabel>Test Results</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                <div className={cn('tab')}>{activeTabComponent}</div>

                {hasMilkId && !loading ? (
                    <div className={cn('actions-panel')}>
                        <ActionsPanel
                            onlyAnalyse={showOnlyAnalyseButton}
                            onAnalyseMilk={handleAnalyseMilk}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
};
