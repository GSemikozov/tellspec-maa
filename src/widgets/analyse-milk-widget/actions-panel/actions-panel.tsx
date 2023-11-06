import React from 'react';
import {
    //useDispatch,
    useSelector,
} from 'react-redux';
import { useIonAlert } from '@ionic/react';

import { classname } from '@shared/utils';
// import { labelPrinterAsyncActions } from '@features/label-printer';
import { selectSensorDevice } from '@entities/sensor';

// import type { AppDispatch } from '@app';

import './actions-panel.css';
import { PreemieButton } from '@ui/button';

const cn = classname('actions-panel');

type ActionsPanelProps = {
    selectedID: string;
    analyseMilkLoading: boolean;
    onAnalyseMilk: () => void;

    showOnlyAnalyse?: boolean;
    isMilkAnalysed?: boolean;
};

export const ActionsPanel: React.FunctionComponent<ActionsPanelProps> = ({
    analyseMilkLoading,
    onAnalyseMilk,
    showOnlyAnalyse,
    // // report,
    selectedID,
    isMilkAnalysed,
}) => {
    // const dispatch = useDispatch<AppDispatch>();

    const [presentAlert] = useIonAlert();

    const currentDevice = useSelector(selectSensorDevice);
    console.log(currentDevice);

    // const handlePrintLabels = () => {
    //     const reportAnalyseDataResult = report.data.analyseData?.result;

    //     if (!reportAnalyseDataResult) {
    //         return;
    //     }

    //     // TODO: not implemented, needs to be clarified
    //     // dispatch(labelPrinterAsyncActions.pairPrinter());
    //     dispatch(
    //         labelPrinterAsyncActions.printLabel({
    //             milkId: report.milk_id,
    //             data: reportAnalyseDataResult,
    //             width: '50',
    //             height: '25',
    //         }),
    //     );
    // };

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

    const handleAnalyseButtonClick = async () =>
        isMilkAnalysed ? handleConfirmReAnalyse() : onAnalyseMilk();

    if (showOnlyAnalyse) {
        const analyseTitle = analyseMilkLoading ? 'Analyse loading...' : 'Analyse This Milk';

        return (
            <div className={cn()}>
                <PreemieButton expand='full' disabled={analyseMilkLoading} onClick={onAnalyseMilk}>
                    {analyseTitle}
                </PreemieButton>
            </div>
        );
    }

    const reAnalyseTitle = analyseMilkLoading ? 'Re-analyse loading...' : 'Re-analyse This Milk';

    return (
        <div className={cn()}>
            {/* <IonButton expand='full' disabled={analyseMilkLoading} onClick={handlePrintLabels}>
                Print Milk Bag Labels
            </IonButton> */}

            <PreemieButton
                expand='full'
                disabled={analyseMilkLoading}
                href={`/pdf/${encodeURIComponent(selectedID)}`}
            >
                Print Milk Test Results
            </PreemieButton>

            {currentDevice ? (
                <PreemieButton
                    expand='full'
                    disabled={analyseMilkLoading || !currentDevice}
                    onClick={handleAnalyseButtonClick}
                >
                    {isMilkAnalysed ? reAnalyseTitle : 'Analyse this milk'}
                </PreemieButton>
            ) : null}
        </div>
    );
};
