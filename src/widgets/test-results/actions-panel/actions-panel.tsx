import React from 'react';
import { useDispatch } from 'react-redux';
import { IonButton } from '@ionic/react';
// import { appActions } from "../../../app";

import { useEvent } from '@shared/hooks';
import { classname } from '@shared/utils';
import { labelPrinterAsyncActions } from '@features/label-printer';

import type { AppDispatch } from '@app';
// import { CustomButton } from '@ui/button/button';

import './actions-panel.css';

const cn = classname('actions-panel');

type ActionsPanelProps = {
    onAnalyseMilk: () => Promise<void>;

    onlyAnalyse?: boolean;
};

export const ActionsPanel: React.FunctionComponent<ActionsPanelProps> = ({
    onlyAnalyse,
    onAnalyseMilk,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleAnalyseMilkEvent = useEvent(onAnalyseMilk);

    const handlePrintTestResults = () => {
        dispatch(labelPrinterAsyncActions.pairPrinter());
    };

    return React.useMemo(() => {
        if (onlyAnalyse) {
            return (
                <div className={cn()}>
                    <IonButton expand='full' onClick={handleAnalyseMilkEvent}>
                        Analyse This Milk
                    </IonButton>
                </div>
            );
        }

        return (
            <div className={cn()}>
                <IonButton expand='full'>Print Label</IonButton>

                <IonButton expand='full' onClick={handlePrintTestResults}>
                    Print Milk Test Results
                </IonButton>

                <IonButton expand='full' onClick={handleAnalyseMilkEvent}>
                    Analyse Another Milk
                </IonButton>

                <IonButton expand='full' onClick={handleAnalyseMilkEvent}>
                    Reanalyse This Milk
                </IonButton>
            </div>
        );
    }, [onlyAnalyse, handleAnalyseMilkEvent]);
};
