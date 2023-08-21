import React from "react";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { LoginForm } from "../../features/login-form/login-form";
import { Logo } from "../../app/components/logo";

export const LoginPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid style={{ height: "100%" }}>
          <div style={{ display: "flex", height: "100%" }}>
            <IonCol size="8" style={{ background: "grey" }} />
            <IonCol
              size="4"
              style={{ display: "flex", flexDirection: "column" }}
              className="ion-justify-content-center ion-align-items-center"
            >
              <div style={{ maxWidth: "70%" }}>
                <Logo />
                <div className="ion-margin-top ion-margin-bottom" />
                <LoginForm />
              </div>
            </IonCol>
          </div>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
