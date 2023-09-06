import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonItem,
  IonRouterOutlet,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
} from "@ionic/react";
import { userAsyncActions } from "../../entities/user";
import { routesMapping } from "../../app/routes";

import type { AppDispatch } from "../../app/store";

import "./sidebar-menu.css";

export const SidebarMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = () => {
    dispatch(userAsyncActions.logout());
  };

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
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
                <IonTabButton
                  tab="home"
                  href={routesMapping.home}
                  onClick={() => handleTabChange("home")}
                >
                  <div className="menu-icon-tab ion-text-start">
                    {activeTab === "home" ? (
                      <img
                        src="../../../assets/images/home-icon-selected.png"
                        className="ion-float-left ion-padding-right"
                      />
                    ) : (
                      <img
                        src="../../../assets/images/home-icon-notSelected.png"
                        className="ion-float-left ion-padding-right"
                      />
                    )}
                    <h4>
                      <IonText
                        color={activeTab === "home" ? "primary" : "tertiary"}
                      >
                        Home
                      </IonText>
                    </h4>
                  </div>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton
                  tab="add"
                  href={routesMapping.addMilk}
                  onClick={() => handleTabChange("addMilk")}
                >
                  <div className="menu-icon-tab ion-text-start">
                    {activeTab === "addMilk" ? (
                      <img
                        src="../../../assets/images/add-milk-selected.png"
                        className="ion-float-left ion-padding-right"
                      />
                    ) : (
                      <img
                        src="../../../assets/images/add-milk-notSelected.png"
                        className="ion-float-left ion-padding-right"
                      />
                    )}
                    <h4>
                      <IonText
                        color={activeTab === "addMilk" ? "primary" : "tertiary"}
                      >
                        Add Milk
                      </IonText>
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
