import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { SidebarMenu } from "../sidebar-menu";

import { SensorInstructions, SensorStatus } from "../../entities/sensor";
import { StatusBar } from "../../features/status-bar/status-bar";

import "./layout.css";

interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
  rightSideBar?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = (props) => {
  const { title, children, rightSideBar = <SensorInstructions /> } = props;

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader> */}

      <IonContent>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="2.5">
              <SidebarMenu />
            </IonCol>
            <IonCol size="9.5">
                <StatusBar />
              <div className="layout-body">
                {/* <IonRow className="ion-align-items-center">
                  <IonCol size="7.8">
                    <User />
                  </IonCol>
                  <IonCol size="3.3">
                    <SensorStatus />
                  </IonCol>
                </IonRow> */}
                <IonRow>
                  <IonCol size="7.5" className="ion-margin main">
                    {children}
                  </IonCol>

                  <IonCol size="4" className="ion-padding">
                    {rightSideBar}
                  </IonCol>
                </IonRow>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
