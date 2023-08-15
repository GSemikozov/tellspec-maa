import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";

export const AddMilkPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add milk</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        Content
      </IonContent>
    </IonPage>
  )
}
