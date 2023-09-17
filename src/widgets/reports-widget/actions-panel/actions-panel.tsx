import React from 'react';
import { IonButton, IonCol, IonRow } from '@ionic/react';

import { classname } from '@shared/utils';
import { routesMapping } from '@app/routes';

import './actions-panel.css';

const cn = classname('actions-panel');

export const ActionsPanel: React.FunctionComponent = () => {
    return (
        <IonRow>
            <IonCol className={cn()}>
                <IonButton>Print Milk Test Results</IonButton>
                <IonButton routerLink={routesMapping.addMilk}>Analyse Another Milk</IonButton>
            </IonCol>
        </IonRow>
    );
};
