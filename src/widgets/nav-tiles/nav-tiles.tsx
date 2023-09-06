import React from "react";
import { Link } from "react-router-dom";
import { IonText } from "@ionic/react";
import { routesMapping } from "../../app/routes";

import "./nav-tiles.css";

export const NavTiles: React.FC = () => {
  return (
    <>
      <Link className="tab" to={routesMapping.addMilk}>
        <img
          src="../../assets/images/logo-tile-top.svg"
          alt="top part of logo"
          className="logo-tile-top"
        />
        <div className="button-tab ion-float-right">
          <img
            className="icons"
            src="../../../assets/images/add-milk-selected.png"
            alt="add milk icon"
          />
        </div>
        <IonText className="ion-text-start">
          <h4>
            Start By Scanning <br />
            The Barcode Or
            <br />
            Entering The Milk ID
          </h4>
        </IonText>
        <IonText className="ion-text-start">
          <h3>Add Milk</h3>
        </IonText>
      </Link>

      <Link className="tab" to={routesMapping.analyse}>
        <img
          src="../../assets/images/logo-tile-middle.svg"
          alt="top part of logo"
          className="logo-tile-middle"
        />
        <div className="button-tab ion-float-right">
          <img
            className="icons"
            src="../../../assets/images/analyse-milk-selected.png"
            alt="analyse milk icon"
          />
        </div>
        <IonText className="ion-text-start">
          <h4>
            Use PREEMIE SENSOR
            <br />
            To Analyse
            <br />
            Selected Milk
          </h4>
        </IonText>
        <IonText className="ion-text-start">
          <h3>Analyse Milk</h3>
        </IonText>
      </Link>

      <Link className="tab" to={routesMapping.reports}>
        <img
          src="../../assets/images/logo-tile-bottom.svg"
          alt="top part of logo"
          className="logo-tile-bottom"
        />
        <div className="button-tab ion-float-right">
          <img
            className="icons"
            src="../../../assets/images/view-reports-selected.png"
            alt="view reports icon"
          />
        </div>
        <IonText className="ion-text-start">
          <h4>
            PrintBags Labels
            <br />
            Or View & Print
            <br />
            Milk Reports
          </h4>
        </IonText>
        <IonText className="ion-text-start">
          <h3>View Reports</h3>
        </IonText>
      </Link>
    </>
  );
};
