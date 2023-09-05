import React from "react";
import { useDispatch } from "react-redux";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonItem,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonText,
} from "@ionic/react";
import { userAsyncActions } from "../../entities/user";
import { routesMapping } from "../../app/routes";

import type { AppDispatch } from "../../app/store";

import "./sidebar-menu.css";

export const SidebarMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(userAsyncActions.logout());
  };

  return (
    <>
      <div className="sidebarMenu">
        <IonItem className="ion-no-margin" id="menu-logo" lines="none">
          <img
            src="../../assets/images/preemieLogoPink.png"
            alt="Preemie Logo"
          />
        </IonItem>

        <IonGrid className="tabs ion-no-padding">
          <IonRow>
            <IonCol>
              <IonTabBar>
                <IonTabButton tab="home" href={routesMapping.home}>
                  <div className="menu-icon-tab ion-text-start">
                    <img
                      src="../../../assets/images/home-icon-selected.png"
                      className="ion-float-left ion-padding-right"
                    />
                    <h4>
                      <IonText color="primary">Home</IonText>
                    </h4>
                  </div>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab="add" href={routesMapping.addMilk}>
                  <div className="menu-icon-tab ion-text-start">
                    <img
                      src="../../../assets/images/add-milk-notSelected.png"
                      className="ion-float-left ion-padding-right"
                    />
                    <h4>
                      <IonText color="tertiary">Add Milk</IonText>
                    </h4>
                  </div>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab="analyse" href={routesMapping.analyse}>
                  <div className="menu-icon-tab ion-text-start">
                    <img
                      src="../../../assets/images/analyse-milk-notSelected.png"
                      className="ion-float-left"
                    />
                    <h4>
                      <IonText color="tertiary">Analyse Milk</IonText>
                    </h4>
                  </div>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab="reports" href={routesMapping.reports}>
                  <div className="menu-icon-tab ion-text-start">
                    <img
                      src="../../../assets/images/view-reports-notSelected.png"
                      className="ion-float-left"
                    />
                    <h4>
                      <IonText color="tertiary">View Reports</IonText>
                    </h4>
                  </div>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab="settings" href="/">
                  <div className="menu-icon-tab ion-text-start">
                    <img
                      src="../../../assets/images/settings-icon-notSelected.png"
                      className="ion-float-left ion-padding-right"
                    />
                    <h4>
                      <IonText color="tertiary">Settings</IonText>
                    </h4>
                  </div>
                </IonTabButton>
              </IonTabBar>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="logout-button">
              <IonTabBar>
                <IonTabButton tab="settings" href="/" onClick={handleLogout}>
                  <div className="menu-icon-tab ion-text-start">
                    <img
                      src="../../../assets/images/logout-icon-notSelected.png"
                      className="ion-float-left ion-padding-right"
                    />
                    <h4>
                      <IonText color="tertiary">Log out</IonText>
                    </h4>
                  </div>
                </IonTabButton>
              </IonTabBar>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    </>
  );
};
