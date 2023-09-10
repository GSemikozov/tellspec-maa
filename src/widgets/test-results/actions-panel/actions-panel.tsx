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
            <IonCol className='ion-justify-content-start'>
                <CustomButton expand='full'>Print Label</CustomButton>
                <CustomButton expand='full' onClick={handlePrintTestResults}>
                    Print Milk Test Results
                </CustomButton>
            </IonCol>

            <IonCol className='ion-justify-content-end'>
                <CustomButton expand='full'>Analyse Another Milk</CustomButton>
                <CustomButton expand='full'>Reanalyse This Milk</CustomButton>
            </IonCol>
        </IonRow>
    );
};
