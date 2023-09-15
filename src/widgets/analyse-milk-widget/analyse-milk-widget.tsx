import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonInput, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
// eslint-disable-next-line import/named
import { InputInputEventDetail, IonInputCustomEvent } from '@ionic/core';

import { BarcodeScanner } from '@ui';
import { AnalyseMilkIcon } from '@ui/icons';
import { tellspecRunScan } from '@api/native';
import { apiInstance } from '@api/network';
import { useEventAsync } from '@shared/hooks';
import { classname } from '@shared/utils';
import { usePreemieToast } from '@shared/ui';
import { selectUserEmail } from '@entities/user/model/user.selectors';
import { CalibrationType } from '@entities/sensor';
import { reportsAsyncActions } from '@entities/reports';
import { fetchMilks, selectMilkList } from '@entities/milk';
import { SpectrumAnalyse } from '@widgets/spectrum-analyse';
import { TestResults } from '@widgets/test-results';

import type { ScanResultType } from 'tellspec-sensor-sdk/src';
import type { IonSegmentCustomEvent, SegmentChangeEventDetail } from '@ionic/core';
// import AnalyseIcon from '../../../assets/images/analyse-milk-selected.png';

// eslint-disable-next-line import/order
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

    const [presentToast] = usePreemieToast();

    const [milkId, setMilkId] = React.useState<string>('');
    const [activeTab, setActiveTab] = React.useState<AnalyseWidgetTabs>(AnalyseWidgetTabs.SPECTRUM);

    const [, setModelScannedData] = React.useState<any>(null);
    const [sensorScannedData, setSensorScannedData] = React.useState<ScanResultType | null>(null);
    const [reportAnalysedData, setReportAnalysedData] = React.useState<Report | null>(null);

    const userEmail = useSelector(selectUserEmail);
    const milkList = useSelector(selectMilkList);

    const handleChangeMilkId = useEventAsync(async (milkId: string) => {
        setMilkId(milkId);
        setActiveTab(AnalyseWidgetTabs.TEST_RESULTS);

        try {
            const reports = await dispatch(
                reportsAsyncActions.fetchReport({ milk_id: milkId }),
            ).unwrap();

            if (!reports || reports.length === 0) {
                throw new Error('Unabled to find milk information');
            }

            setReportAnalysedData(reports[0]);
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error.mesasge,
            });
        }
    });

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

            setSensorScannedData(newSensorScanData);
            setActiveTab(AnalyseWidgetTabs.SPECTRUM);
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error.mesasge,
            });
        }
    });

    React.useEffect(() => {
        dispatch(fetchMilks());
    }, []);

    React.useEffect(() => {
        if (!reportAnalysedData) {
            return;
        }

        setActiveTab(AnalyseWidgetTabs.TEST_RESULTS);
    }, [reportAnalysedData]);

    const milkOptions = React.useMemo(
        () =>
            milkList.map(milk => ({
                value: milk.milk_id,
                title: milk.milk_id,
            })),
        [milkList],
    );

    const activeTabComponent = React.useMemo(() => {
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

        return (
            <TestResults
                reportAnalysedData={reportAnalysedData}
                onAnalyseMilk={handleAnalyseMilk}
            />
        );
    }, [milkId, activeTab, reportAnalysedData, sensorScannedData, handleAnalyseMilk]);

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
                    <IonInput
                        value={milkId}
                        onIonInput={(event: IonInputCustomEvent<InputInputEventDetail>) =>
                            setMilkId(event.target.value as string)
                        }
                    />
                    <BarcodeScanner
                        title='Select, Scan or Enter Milk ID'
                        options={milkOptions}
                        value={milkId}
                        onChange={handleChangeMilkId}
                    />
                </div>
            </div>

            <div className={cn('tabs')}>
                <IonSegment value={activeTab} disabled={!milkId} onIonChange={handleChangeTab}>
                    <IonSegmentButton value={AnalyseWidgetTabs.SPECTRUM}>
                        <IonLabel>Spectrum</IonLabel>
                    </IonSegmentButton>

                    <IonSegmentButton value={AnalyseWidgetTabs.TEST_RESULTS}>
                        <IonLabel>Test Results</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                <div className={cn('tab')}>{activeTabComponent}</div>
            </div>
        </div>
    );
};
