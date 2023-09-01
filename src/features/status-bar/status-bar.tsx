import React from "react";
import { useSelector } from "react-redux";
import { userSelectors } from "../../entities/user";
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import TargetOffline from "../../../resources/icons/target-offline.svg";
import TargetYellow from "../../../resources/icons/target-yellow.svg"
import TargetRed from "../../../resources/icons/target-red.svg"
import BatteryOffline from "../../../resources/icons/battery-offline.svg"
import BatteryCharging from "../../../resources/icons/battery-charging.svg";
import BatteryFull from "../../../resources/icons/battery-full.svg";
import BatteryEmpty from "../../../resources/icons/battery-empty.svg";
import BluetoothOffline from "../../../resources/icons/bluetooth-offline.svg";
import BluetoothBlue from "../../../resources/icons/bluetooth-blue.svg";
import BluetoothGreen from "../../../resources/icons/bluetooth-green.svg";

import "./status-bar.css";

export const StatusBar: React.FC = () => {
  const user = useSelector(userSelectors.getUser);
  return (
    <IonGrid fixed={true} style={{ height: "8%" }}>
      <IonRow>
        <IonCol>
          <div className="ion-text-end user-name">
            <h2>
              Welcome back {user.first_name} {user.last_name}!
            </h2>
          </div>
        </IonCol>
        <IonCol size="4.5">
          <div className="ion-text-start bluetoothSensor">
            <div className="sensor-status">
                <h5>
                    <IonText>Turn on and connect a sensor</IonText>
                </h5>
            </div>
            <div className="icons-wrapper">
              <IonIcon size="large" icon={TargetOffline} />
              <IonIcon size="large" icon={BatteryOffline} />
              <IonIcon size="large" icon={BluetoothOffline} />
            </div>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
