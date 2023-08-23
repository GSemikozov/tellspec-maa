import React from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { userAsyncActions, userSelectors } from "../../entities/user";
import type { AppDispatch } from "../../app/store";

export const HomePage: React.FC = () => {
  const user = useSelector(userSelectors.getUser);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(userAsyncActions.logout());
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {JSON.stringify(user)}
        <IonButton onClick={handleLogout}>Logout</IonButton>
      </IonContent>
    </IonPage>
  )
}
