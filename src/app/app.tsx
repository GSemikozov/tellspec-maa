import React from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { LoginPage } from '@pages/login';
import { HomePage } from '@pages/home';
import { AnalysePage } from '@pages/analyse';
import { AddMilkPage } from '@pages/add-milk';
import { ReportsPage } from '@pages/reports';
import { SettingsPage } from '@pages/settings';
import { userSelectors } from '@entities/user';
import { retrieveBlePermissions } from '@api/native';
import { SensorConnectionProcessProvider } from '@widgets/sensor-connection-process';

import { fetchAppSettings } from './model/app.actions';
import { routesMapping } from './routes';
import { ProtectedRoute } from './components/protected-route';

import type { AppDispatch } from './store';

import './app.css';

setupIonicReact();

export const App: React.FunctionComponent = () => {
    const isAuthenticated = useSelector(userSelectors.isUserAuthenticated);

    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        dispatch(fetchAppSettings());
    }, []);

    React.useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        retrieveBlePermissions();
    }, [isAuthenticated]);

    return (
        <SensorConnectionProcessProvider>
            <IonApp>
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route exact path={routesMapping.login}>
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

                        <ProtectedRoute exact path={routesMapping.settings}>
                            <SettingsPage />
                        </ProtectedRoute>
                    </IonRouterOutlet>
                </IonReactRouter>
            </IonApp>
        </SensorConnectionProcessProvider>
    );
};
