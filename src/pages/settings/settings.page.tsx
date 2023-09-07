import React from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Layout } from "../../widgets/layout";
import "./settings.css";

import SettingsIcon from "../../../assets/images/settings-icon-selected.png";
import TargetIcon from "../../../assets/icons/target-pink.svg";

export const SettingsPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <Layout>
          <div className="settings-wrapper">
            <IonItem>
              <img src={SettingsIcon} className="settings-icon" />
              <h4>
                <IonText className="ion-padding">Settings</IonText>
              </h4>
            </IonItem>
            <div className="settings-title">
              <p>
                <IonText>Preemie Sensor</IonText>
              </p>
              <span className="calibrate-sensor">
                <button>
                  Calibrate Sensor <img src={TargetIcon} />
                </button>
              </span>
            </div>
            <div className="options">
              <p>
                <IonText>Connected to</IonText>
              </p>
            </div>
            <div className="line" />
            <div className="options">
              <p>
                <IonText>Connect another Sensor</IonText>
              </p>
              <button className="add-button">ADD</button>
            </div>
            <div className="settings-title">
              <p>
                <IonText>Expressed Milk</IonText>
              </p>
            </div>
            <div className="options">
              <p>
                <IonText>Expiring Date</IonText>
              </p>
              <IonSelect
                label="Milk Expiration Date"
                label-placement="floating"
              >
                <IonSelectOption value="6 months">6 Months</IonSelectOption>
                <IonSelectOption value="9 months">9 Months</IonSelectOption>
                <IonSelectOption value="12 months">12 Months</IonSelectOption>
              </IonSelect>
            </div>
            <div className="settings-title">
              <p>
                <IonText>Storage Management</IonText>
              </p>
            </div>
            <div className="options">
              <p>
                <IonText>Available storages</IonText>
              </p>
            </div>
            <div className="line" />
            <div className="options">
              <p>
                <IonText>Disabled storages</IonText>
              </p>
            </div>
            <div className="line" />
            <div className="options">
              <p>
                <IonText>Add another Storage</IonText>
              </p>
              <button className="add-button">ADD</button>
            </div>
            <div className="line" />
            <div className="button-wrapper">
              <IonButton fill="outline">CANCEL</IonButton>
              <IonButton>SAVE CHANGES</IonButton>
            </div>
          </div>
        </Layout>
      </IonContent>
    </IonPage>
  );
};
