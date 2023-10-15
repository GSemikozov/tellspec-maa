import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { PDFPage } from '@pages/pdf';
import { LoginPage } from '@pages/login';
import { ForgetPasswordPage } from '@pages/forget-password';
import { HomePage } from '@pages/home';
import { AnalysePage } from '@pages/analyse';
import { AddMilkPage } from '@pages/add-milk';
import { ReportsPage } from '@pages/reports';
import { SettingsPage } from '@pages/settings';
import { SensorPage } from '@pages/sensor-page';
import { userSelectors } from '@entities/user';
import { NativeStorageKeys, nativeStore, useSetupStore } from '@api/native';
import { SensorConnectionProcessProvider } from '@widgets/sensor-connection-process';
import { selectIsAppFetching, selectLayoutClassName } from '@app/model';

import { fetchAppSettings, fetchBleStatus } from './model/app.actions';
import { routesMapping } from './routes';
import { PublicOnlyRoute, ProtectedRoute } from './components';

import type { AppDispatch } from './store';

import './app.css';

setupIonicReact();

export const App: React.FunctionComponent = () => {
    const readyStore = useSetupStore();

    const isAppFetching = useSelector(selectIsAppFetching);
    const isAuthenticated = useSelector(userSelectors.isUserAuthenticated);
    const layoutClassName = useSelector(selectLayoutClassName);

    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        if (!readyStore) {
            return;
        }

        dispatch(fetchAppSettings());

        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            nativeStore.set(NativeStorageKeys.IS_EMULATE_NATIVE_SDK, searchParams.has('emulate'));
        }
    }, [readyStore]);

    React.useEffect(() => {
        if (!readyStore) {
            return;
        }

        if (!isAuthenticated) {
            return;
        }

        dispatch(fetchBleStatus());
    }, [isAuthenticated]);

    if (!readyStore || isAppFetching) {
        return null;
    }

    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet className={layoutClassName} animated={false}>
                    <PublicOnlyRoute exact path={routesMapping.login}>
                        <LoginPage />
                    </PublicOnlyRoute>

                    <SensorConnectionProcessProvider>
                        <PublicOnlyRoute exact path={routesMapping.forgetPassword}>
                            <ForgetPasswordPage />
                        </PublicOnlyRoute>

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

                        <ProtectedRoute exact path={routesMapping.sensorPage}>
                            <SensorPage />
                        </ProtectedRoute>

                        <ProtectedRoute exact path={routesMapping.pdfPage} component={PDFPage} />
                    </SensorConnectionProcessProvider>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};
