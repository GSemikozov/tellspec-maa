import React from 'react';
import { useDispatch } from 'react-redux';
import { IonButton, IonCol, IonRow } from '@ionic/react';
// import { appActions } from "../../../app";

import { labelPrinterAsyncActions } from '@features/label-printer';

import type { AppDispatch } from '@app';
import { CustomButton } from '@ui/button/button';

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
            <IonCol>
                <IonButton expand="full">Print Label</IonButton>
            </IonCol>
            <IonCol>
                <IonButton expand="full" onClick={handlePrintTestResults}>Print Milk Test Results</IonButton>
            </IonCol>
            <IonCol>
                <IonButton expand="full">Analyse Another Milk</IonButton>
            </IonCol>
            <IonCol>
                <IonButton expand="full">Reanalyse This Milk</IonButton>
            </IonCol>
        </IonRow>
    );
};
