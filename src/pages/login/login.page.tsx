import React from "react";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonPage,
  IonRow,
} from "@ionic/react";
import { LoginForm } from "../../features/login-form/login-form";
import './login-page.css'
import { Logo } from "../../ui";

export const LoginPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="8" className="login-img">
              <IonItem lines="none">
                <img
                  src="../../resources/images/login-screen-hero.jpg"
                  alt="milk bottle picture"
                />
              </IonItem>
            </IonCol>
            <IonCol>
                <Logo />
                <div className="ion-margin-top ion-margin-bottom" />
                <LoginForm />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
