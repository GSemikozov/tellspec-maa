import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ProtectedRoute } from './components/protected-route';
import { routesMapping } from './routes';

import { fetchAppSettings } from './model/app.actions';

import { LoginPage } from '../pages/login';
import { HomePage } from '../pages/home';
import { AnalysePage } from '../pages/analyse';
import { AddMilkPage } from '../pages/add-milk';
import { ReportsPage } from '../pages/reports';

import './app.css';

setupIonicReact();

export const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAppSettings());
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path='/login'>
            <LoginPage />
          </Route>

          <ProtectedRoute exact path={routesMapping.home}>
            <HomePage />
          </ProtectedRoute>
          <ProtectedRoute exact path={routesMapping.addMilk}>
            <AddMilkPage />
          </ProtectedRoute>
          <ProtectedRoute exact path={routesMapping.analyse}>
            <AnalysePage />
          </ProtectedRoute>
          <ProtectedRoute exact path={routesMapping.reports}>
            <ReportsPage />
          </ProtectedRoute>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};
