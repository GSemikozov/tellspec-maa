import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

export const ReportsPage: React.FunctionComponent = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Reports</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>Content</IonContent>
        </IonPage>
    );
};
