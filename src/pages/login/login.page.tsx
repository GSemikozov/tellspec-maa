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
import "./login-page.css";
import { Logo } from "../../ui";

export const LoginPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="8">
              <IonItem lines="none" className="ion-no-padding">
                <img
                  src="../../resources/images/login-screen-hero.jpg"
                  alt="milk bottle picture"
                  id="img-login-screen"
                />
              </IonItem>
            </IonCol>
            <IonCol>
              <div className="logo-login-screen">
              <Logo />
              </div>
              <div className="ion-margin-top ion-margin-bottom" />
              <LoginForm />
              <p className="rights">
                <small>© 2021-2023 TellSpec LTD All right Reserved</small>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
