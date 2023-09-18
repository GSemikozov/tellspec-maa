import React from 'react';
import { useDispatch } from 'react-redux';
import { IonButton, useIonAlert } from '@ionic/react';

import { classname } from '@shared/utils';
import { labelPrinterAsyncActions } from '@features/label-printer';

import type { AppDispatch } from '@app';

import './actions-panel.css';

const cn = classname('actions-panel');

type ActionsPanelProps = {
    analyseMilkLoading: boolean;
    onAnalyseMilk: () => Promise<void>;

    showOnlyAnalyse?: boolean;
};

export const ActionsPanel: React.FunctionComponent<ActionsPanelProps> = ({
    analyseMilkLoading,
    onAnalyseMilk,

    showOnlyAnalyse,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [presentAlert] = useIonAlert();

    const handlePrintTestResults = () => {
        dispatch(labelPrinterAsyncActions.pairPrinter());
    };

    const handleConfirmReAnalyse = async () => {
        await presentAlert({
            subHeader:
                'This milk has been previously analysed. Re-analysing may give slightly different results due to environmental conditions and milk age. Do you want to proceed?',
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
