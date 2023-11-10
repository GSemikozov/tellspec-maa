import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonAlert } from '@ionic/react';

import { usePreemieToast } from '@ui';
import { useEvent } from '@shared/hooks';
import { AppDispatch } from '@app';
import { apiInstance } from '@api/network';
import { TellspecSensorScannedData, tellspecRetrieveDeviceConnect } from '@api/native';

import { runSensorScan, selectSensorDevice } from '../model';
import { CalibrationType, SpectrumScanData } from '../api';

import type { Report } from '@entities/reports';

export type OnCompleteOptions = {
    newReport: Report;
    newModelData: any;
    newSensorScanData: SpectrumScanData | TellspecSensorScannedData;
};

export type UseRunScanSensorOptions = {
    onComplete: (options: OnCompleteOptions) => Promise<void>;
};

export type UseRunScanSensorResult = [
    (report: Report | null, userEmail: string) => Promise<void>,
    { loading: boolean; scanValidationResultComponent: React.ReactNode },
];

export const useRunScanSensor = ({
    onComplete,
}: UseRunScanSensorOptions): UseRunScanSensorResult => {
    const dispatch = useDispatch<AppDispatch>();

    const handleCompleteEvent = useEvent(onComplete);

    const [presentToast, dismissToast] = usePreemieToast();

    const [loading, setLoading] = React.useState(false);
    const [scanValidationResult, setScanValidationResult] = React.useState<string>('');

    const currentDevice = useSelector(selectSensorDevice);

    const call = React.useCallback(
        async (report: Report | null, userEmail: string) => {
            setScanValidationResult('');

            try {
                await tellspecRetrieveDeviceConnect(currentDevice?.uuid ?? '');

                if (!report) {
                    throw new Error('Missing milk report');
                }

                setLoading(true);

                const runSensorScanResponse = await dispatch(runSensorScan(userEmail)).unwrap();

                if (!runSensorScanResponse) {
                    throw new Error('An error occured on analyse milk');
                }

                const { saveScanResponse, sensorScannedData } = runSensorScanResponse;

                if (
                    !sensorScannedData ||
                    !sensorScannedData.uuid ||
                    !sensorScannedData.absorbance
                ) {
                    throw new Error('An error occured on analyse milk');
                }

                const saveScanResponseValidationResult = saveScanResponse['scan-validation'];

                if (saveScanResponseValidationResult.includes('bad')) {
                    throw new Error('Result is bad, please repeat the scan.');
                }

                const scanId = sensorScannedData.uuid;

                const modelData = await apiInstance.sensor.runModel({
                    scans: [scanId],
                    average: false,
                    'calib-to-use': CalibrationType.FACTORY,
                });

                const updatedReport: Report = {
                    ...report,
                    data: {
                        ...report.data,
                        analyseData: {
                            scanId,
                            result: modelData,
                        },
                    },
                };

                await apiInstance.reports.updateReport(updatedReport);

                setScanValidationResult(saveScanResponseValidationResult);

                handleCompleteEvent({
                    newReport: updatedReport,
                    newModelData: modelData,
                    newSensorScanData: sensorScannedData,
                });
            } catch (error: any) {
                console.error('[runScanSensor]:', error);

                await dismissToast();
                await presentToast({
                    type: 'error',
                    message:
                        error.message === 'disconnectDevice'
                            ? 'Please connect a Preemie sensor first'
                            : error.message,
                });
            } finally {
                setLoading(false);
            }
        },
        [currentDevice],
    );

    const scanValidationResultComponent = React.useMemo(() => {
        const isOpen = scanValidationResult !== '';

        let message = '';

        if (scanValidationResult.includes('bad')) {
            message =
                'The scan was not usable. Please consider rescanning, or taking a new sample. If the problem persistes, please contact info@preemiesensor.com';
        } else if (scanValidationResult.includes('not_ideal')) {
            message =
                'There may be a problem with the scan. Please consider rescanning, or taking a new sample.';
        }

        return (
            <IonAlert
                header='Scan Validation Result'
                isOpen={isOpen}
                message={message}
                buttons={['OK']}
            />
        );
    }, [scanValidationResult]);

    return [call, { loading, scanValidationResultComponent }];
};
