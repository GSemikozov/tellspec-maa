import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

import { Layout } from '@widgets/layout';
import { NavTiles } from '@widgets/nav-tiles';

import './home-page.css';
import { BeforeCalibrationModal } from '@entities/sensor/ui/before-calibration-modal';

export const HomePage: React.FunctionComponent = () => {
    return (
        <IonPage>
            <IonContent>
                <Layout>
                    <BeforeCalibrationModal />
                    <NavTiles />
                </Layout>
            </IonContent>
        </IonPage>
    );
};
