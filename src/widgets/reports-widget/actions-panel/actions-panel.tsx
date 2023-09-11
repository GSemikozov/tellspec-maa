import React from "react";
import { IonButton, IonCol, IonRow } from "@ionic/react";

export const ActionsPanel: React.FC = () => {
    return (
        <IonRow>
            <IonCol className="ion-justify-content-start">
                <IonButton>Print Milk Bag Labels</IonButton>
                <IonButton>
                    Print Milk Test Results
                </IonButton>
            </IonCol>

            <IonCol className="ion-justify-content-end">
                <IonButton>Analyse Another Milk</IonButton>
            </IonCol>
        </IonRow>
    )
}