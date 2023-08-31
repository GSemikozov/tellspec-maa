import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { userAsyncActions, userSelectors } from "../../entities/user";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterOutlet,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
} from "@ionic/react";
import { logoIonic } from "ionicons/icons";
import "./home-page.menu.css";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";
import { HomePage } from "../../pages/home/home.page";

export const HomePageMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(userAsyncActions.logout());
  };
  return (
    <>
      <div className="main-body">
              <IonItem
                className="ion-no-margin"
                id="menu-logo"
                lines="none"
                color="tertiary"
              >
                <img
                  src="../../resources/preemieLogoPink.svg"
                  alt="Preemie Logo"
                />
              </IonItem>
        <IonGrid className="tabs ion-no-padding">
          <IonRow>
            <IonCol>
              <IonTabBar>
                <IonTabButton tab="home" href="/">
                  <IonText>
                    <h4 className="ion-text-start">Home</h4>
                  </IonText>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab="addMilk" href="/">
                  <IonText>
                    <h4 className="ion-text-start">Add Milk</h4>
                  </IonText>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab="analyseMilk" href="/">
                  <IonText>
                    <h4 className="ion-text-start">Analyse Milk</h4>
                  </IonText>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab="reports" href="/">
                  <IonText>
                    <h4 className="ion-text-start">View Reports</h4>
                  </IonText>
                </IonTabButton>
              </IonTabBar>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="logout-button">
              <div className="logout-button">
                <IonButton onClick={handleLogout} color="primary" fill="clear">
                  <h4>Logout</h4>
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
       </IonGrid>
      </div>
    </>
  );
};
