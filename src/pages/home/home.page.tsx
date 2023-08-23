import React from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonNav,
  IonNavLink,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { userAsyncActions, userSelectors } from "../../entities/user";
import type { AppDispatch } from "../../app/store";
import { AddMilkPage } from "../add-milk";
import { useHistory } from "react-router";

export const HomePage: React.FC = () => {
  const user = useSelector(userSelectors.getUser);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(userAsyncActions.logout());
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="secondary">
            <IonButton onClick={handleLogout} color="danger">
              Logout
            </IonButton>
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {JSON.stringify(user)}
        <div>
          <IonButton onClick={() => history.push("/add-milk")}>
            Add milk
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
