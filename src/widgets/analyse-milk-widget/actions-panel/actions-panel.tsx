import React from 'react';
import { useDispatch } from 'react-redux';
import { IonButton, useIonAlert } from '@ionic/react';

import { classname } from '@shared/utils';
import { labelPrinterAsyncActions } from '@features/label-printer';

import type { AppDispatch } from '@app';
import type { Report } from '@entities/reports';

import './actions-panel.css';

const cn = classname('actions-panel');

type ActionsPanelProps = {
    analyseMilkLoading: boolean;
    onAnalyseMilk: () => Promise<void>;
    showOnlyAnalyse?: boolean;
    report: Report;
};

export const ActionsPanel: React.FunctionComponent<ActionsPanelProps> = ({
    analyseMilkLoading,
    onAnalyseMilk,
    showOnlyAnalyse,
    report,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [presentAlert] = useIonAlert();

    const handlePrintTestResults = () => {
        const reportAnalyseDataResult = report.data.analyseData?.result;

        if (!reportAnalyseDataResult) {
            return;
        }

        dispatch(labelPrinterAsyncActions.pairPrinter());
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

    if (showOnlyAnalyse) {
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
            <IonButton expand='full' disabled={analyseMilkLoading} onClick={handlePrintTestResults}>
                Print Milk Test Results
            </IonButton>

            <IonButton expand='full' disabled={analyseMilkLoading} onClick={handleConfirmReAnalyse}>
                {reAnalyseTitle}
            </IonButton>
        </div>
    );
};
