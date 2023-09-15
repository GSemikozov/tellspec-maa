import React from 'react';
import { useDispatch } from 'react-redux';
import { IonButton } from '@ionic/react';

import { useEventAsync } from '@shared/hooks';
import { classname } from '@shared/utils';
import { labelPrinterAsyncActions } from '@features/label-printer';

import type { AppDispatch } from '@app';

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

    const [analyseLoading, setAnalyzeLoading] = React.useState(false);

    const handleAnalyseMilkEvent = useEventAsync(async () => {
        setAnalyzeLoading(true);

        await onAnalyseMilk();

        setAnalyzeLoading(false);
    });

    const handlePrintTestResults = () => {
        dispatch(labelPrinterAsyncActions.pairPrinter());
    };

    return React.useMemo(() => {
        if (onlyAnalyse) {
            const analyseTitle = analyseLoading ? 'Analyse loading...' : 'Analyse This Milk';

            return (
                <div className={cn()}>
                    <IonButton
                        expand='full'
                        disabled={analyseLoading}
                        onClick={handleAnalyseMilkEvent}
                    >
                        {analyseTitle}
                    </IonButton>
                </div>
            );
        }

        const reAnalyseTitle = analyseLoading ? 'Re-analyse loading...' : 'Re-analyse This Milk';

        return (
            <div className={cn()}>
                <IonButton expand='full'>Print Label</IonButton>

                <IonButton expand='full' onClick={handlePrintTestResults}>
                    Print Milk Test Results
                </IonButton>

                <IonButton expand='full'>Analyse Another Milk</IonButton>

                <IonButton expand='full' disabled={analyseLoading} onClick={handleAnalyseMilkEvent}>
                    {reAnalyseTitle}
                </IonButton>
            </div>
        );
    }, [onlyAnalyse, analyseLoading, handleAnalyseMilkEvent]);
};
