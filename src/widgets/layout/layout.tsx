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
import { useSelector } from "react-redux";
import { SensorInstructions, SensorStatus } from "../../entities/sensor";
import { StatusBar } from "../../features/status-bar/status-bar";
import { appSelectors } from "../../app";

import "./layout.css";
import {User} from "../../entities/user";

interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
  rightSideBar?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = (props) => {
  const { title, children, rightSideBar = <SensorInstructions /> } = props;
  const isSidebarVisible = useSelector(appSelectors.isSidebarVisible);

  return (
    <IonPage>
      <IonContent>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="2.5">
              <SidebarMenu />
            </IonCol>
            <IonCol size="9.5">
                <SensorStatus />
              <div className="layout-body">
                <IonRow className="ion-align-items-center">
                  <IonCol size="7.8">
                    <User />
                  </IonCol>
                  <IonCol size="3.3">
                    <SensorStatus />
                  </IonCol>
                </IonRow>
                <IonRow>
                  {/* TODO: something strange is here in the size property */}
                  <IonCol size={isSidebarVisible ? '7.5' : '11.5'} className="ion-margin main">
                    {children}
                  </IonCol>

                  {
                    isSidebarVisible ? (
                        <IonCol size="4" className="ion-padding">
                          {rightSideBar}
                        </IonCol>
                    ) : null
                  }
                </IonRow>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
