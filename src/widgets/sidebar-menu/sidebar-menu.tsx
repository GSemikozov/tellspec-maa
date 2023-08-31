import React from 'react';
import { useDispatch } from 'react-redux';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonItem,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonText,
} from '@ionic/react';
import { userAsyncActions } from '../../entities/user';
import { routesMapping } from '../../app/routes';

import type { AppDispatch } from '../../app/store';

import './sidebar-menu.css';

export const SidebarMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(userAsyncActions.logout());
  };

  return (
    <>
      <div className='sidebarMenu'>
        <IonItem className='ion-no-margin' id='menu-logo' lines='none' color='tertiary'>
          <img src='../../resources/preemieLogoPink.svg' alt='Preemie Logo' />
        </IonItem>

        <IonGrid className='tabs ion-no-padding'>
          <IonRow>
            <IonCol>
              <IonTabBar>
                <IonTabButton tab='home' href={routesMapping.home}>
                  <IonText>
                    <h4 className='ion-text-start'>Home</h4>
                  </IonText>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab='add' href={routesMapping.addMilk}>
                  <IonText>
                    <h4 className='ion-text-start'>Add Milk</h4>
                  </IonText>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab='analyse' href={routesMapping.analyse}>
                  <IonText>
                    <h4 className='ion-text-start'>Analyse Milk</h4>
                  </IonText>
                </IonTabButton>
              </IonTabBar>
              <IonTabBar>
                <IonTabButton tab='reports' href={routesMapping.reports}>
                  <IonText>
                    <h4 className='ion-text-start'>View Reports</h4>
                  </IonText>
                </IonTabButton>
              </IonTabBar>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol className='logout-button'>
              <IonButton onClick={handleLogout} color='primary' fill='clear'>
                <h4>Logout</h4>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    </>
  );
};
