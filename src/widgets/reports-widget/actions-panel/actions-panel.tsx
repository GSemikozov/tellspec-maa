import React from "react";
import { IonButton, IonCol, IonRow } from "@ionic/react";

import './actions-panel.css'

export const ActionsPanel: React.FC = () => {
    return (
        <IonRow>
            <IonCol className='reports-buttons-wrapper'>
                <IonButton>Print Milk Bag Labels</IonButton>
                <IonButton>Print Milk Test Results</IonButton>
                <IonButton>Analyse Another Milk</IonButton>
            </IonCol>
        </IonRow>
    );
}