import React from 'react';
import { Link } from 'react-router-dom';
import { IonText } from '@ionic/react';
import { routesMapping } from '../../app/routes';

import './nav-tiles.css'

export const NavTiles: React.FC = () => {
  return (
    <>
      <Link className="tab" to={routesMapping.addMilk}>
        <div className="button-tab ion-float-left">
          <img
            className="icons"
            src="../../../assets/images/add-milk-selected.png"
            alt="add milk icon"
          />
        </div>
        <IonText className="ion-text-end ">
          <h4>
            Start By Scanning <br />
            The Barcode Or
            <br />
            Entering The Milk ID
          </h4>
        </IonText>
        <IonText className="ion-text-end">
          <h3>Add Milk</h3>
        </IonText>
      </Link>

      <Link className="tab" to={routesMapping.analyse}>
        <div className="button-tab ion-float-left">
          <img
            className="icons"
            src="../../../assets/images/analyse-milk-selected.png"
            alt="analyse milk icon"
          />
        </div>
        <IonText className="ion-text-end ">
          <h4>
            Use PREEMIE SENSOR
            <br />
            To Analyse
            <br />
            Selected Milk
          </h4>
        </IonText>
        <IonText className="ion-text-end">
          <h3>Analyse Milk</h3>
        </IonText>
      </Link>

      <Link className="tab" to={routesMapping.reports}>
        <div className="button-tab ion-float-left">
          <img
            className="icons"
            src="../../../assets/images/view-reports-selected.png"
            alt="view reports icon"
          />
        </div>
        <IonText className="ion-text-end">
          <h4>
            PrintBags Labels
            <br />
            Or View & Print
            <br />
            Milk Reports
          </h4>
        </IonText>
        <IonText className="ion-text-end">
          <h3>View Reports</h3>
        </IonText>
      </Link>
    </>
  );
};
