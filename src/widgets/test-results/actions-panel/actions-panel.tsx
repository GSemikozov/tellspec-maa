import React from 'react';
import { useDispatch } from 'react-redux';
import { IonButton, IonCol, IonRow } from '@ionic/react';
// import { appActions } from "../../../app";

import { labelPrinterAsyncActions } from '@features/label-printer';

import type { AppDispatch } from '@app';

export const ActionsPanel: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handlePrintTestResults = () => {
        // dispatch(appActions.showAlert({
        //   alertHeader: 'Test',
        //   alertSubHeader: 'test subheader',
        //   alertMessage: 'message'
        // }));

        // dispatch(appActions.showBackdrop({
        //   backdropText: 'test',
        // }))

        dispatch(labelPrinterAsyncActions.pairPrinter());
    };

    return (
        <IonRow>
            <IonCol className='ion-justify-content-start'>
                <IonButton>Print Label</IonButton>
                <IonButton onClick={handlePrintTestResults}>Print Milk Test Results</IonButton>
            </IonCol>

            <IonCol className='ion-justify-content-end'>
                <IonButton>Analyse Another Milk</IonButton>
                <IonButton>Reanalyse This Milk</IonButton>
            </IonCol>
        </IonRow>
    );
};
