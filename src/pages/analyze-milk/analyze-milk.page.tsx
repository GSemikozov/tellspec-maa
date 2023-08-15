import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";

export const AnalyzeMilkPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Anylize</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        Analyze page
      </IonContent>
    </IonPage>
  )
}
