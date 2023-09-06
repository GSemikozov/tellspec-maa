import React from "react";
import { useSelector } from "react-redux";
import { userSelectors } from "../../../user";
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import { User } from "../../../user";

// ICONS
import TargetOffline from "../../../../../assets/icons/target-offline.svg"
import TargetYellow from "../../../../../assets/icons/target-yellow.svg";
import TargetRed from "../../../../../assets/icons/target-red.svg";
import BatteryOffline from "../../../../../assets/icons/battery-offline.svg";
import BatteryCharging from "../../../../../assets/icons/battery-charging.svg";
import BatteryFull from "../../../../../assets/icons/battery-full.svg";
import BatteryEmpty from "../../../../../assets/icons/battery-empty.svg";
import BluetoothOffline from "../../../../../assets/icons/bluetooth-offline.svg";
import BluetoothBlue from "../../../../../assets/icons/bluetooth-blue.svg";
import BluetoothGreen from "../../../../../assets/icons/bluetooth-green.svg";

import './sensor-status.css'

export const SensorStatus: React.FC = () => {
  const user = useSelector(userSelectors.getUser);
  return (
    <IonGrid fixed={true} style={{ height: "10%" }}>
      <IonRow>
        <IonCol>
          <div className="ion-text-end user-name">
            {/* <h2>
              Welcome back {user.first_name} {user.last_name}!
            </h2> */}
            <User />
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

