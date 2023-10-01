import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonButton, IonModal, useIonAlert } from '@ionic/react';

import { classname } from '@shared/utils';
import { labelPrinterAsyncActions } from '@features/label-printer';
import { PDFReport } from '@entities/reports/components';
import { selectSensorDevice } from '@entities/sensor';

import type { AppDispatch } from '@app';
import type { Report } from '@entities/reports';

import './actions-panel.css';

const cn = classname('actions-panel');

type ActionsPanelProps = {
    report: Report;
    analyseMilkLoading: boolean;
    onAnalyseMilk: () => Promise<void>;

    showOnlyAnalyse?: boolean;
};

export const ActionsPanel: React.FunctionComponent<ActionsPanelProps> = ({
    analyseMilkLoading,
    onAnalyseMilk,
    showOnlyAnalyse,
    report,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [presentAlert] = useIonAlert();
    const [showPDFModal, setShowPDFModal] = useState(false);

    const currentSensor = useSelector(selectSensorDevice);

    const handlePrintLabels = () => {
        const reportAnalyseDataResult = report.data.analyseData?.result;

        if (!reportAnalyseDataResult) {
            return;
        }

        // TODO: not implemented, needs to be clarified
        // dispatch(labelPrinterAsyncActions.pairPrinter());
        dispatch(
            labelPrinterAsyncActions.printLabel({
                milkId: report.milk_id,
                data: reportAnalyseDataResult,
                width: '50',
                height: '25',
            }),
        );
    };

    const handleConfirmReAnalyse = async () => {
        await presentAlert({
            subHeader:
                'This milk has been previously analysed. Re-analysing may give slightly different ' +
                'results due to environmental conditions and milk age. Do you want to proceed?',
            buttons: [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Continue',
                    handler: () => {
                        onAnalyseMilk();
                    },
                },
            ],
        });
    };

    const handlePrintTestResults = () => {
        setShowPDFModal(true);
    };

    const handlePDFModalClose = () => setShowPDFModal(false);

    if (currentSensor && showOnlyAnalyse) {
        const analyseTitle = analyseMilkLoading ? 'Analyse loading...' : 'Analyse This Milk';

        return (
            <div className={cn()}>
                <IonButton expand='full' disabled={analyseMilkLoading} onClick={onAnalyseMilk}>
                    {analyseTitle}
                </IonButton>
            </div>
        );
    }

    const reAnalyseTitle = analyseMilkLoading ? 'Re-analyse loading...' : 'Re-analyse This Milk';

    return (
        <div className={cn()}>
            <IonButton expand='full' disabled={analyseMilkLoading} onClick={handlePrintLabels}>
                Print Milk Bag Labels
            </IonButton>

            <IonButton expand='full' disabled={analyseMilkLoading} onClick={handlePrintTestResults}>
                Print Milk Test Results
            </IonButton>

            <IonButton expand='full' disabled={analyseMilkLoading} onClick={handleConfirmReAnalyse}>
                {reAnalyseTitle}
            </IonButton>

            {showPDFModal && report.data.analyseData && (
                <IonModal
                    className={cn('modal')}
                    isOpen={showPDFModal}
                    onIonModalDidDismiss={handlePDFModalClose}
                >
                    <PDFReport report={report} onClose={handlePDFModalClose} />
                </IonModal>
            )}
        </div>
    );
};
