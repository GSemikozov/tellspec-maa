import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

import { Layout } from '@widgets/layout';
import { NavTiles } from '@widgets/nav-tiles';

import './home-page.css';

export const HomePage: React.FunctionComponent = () => {
    return (
        <IonPage>
            <IonContent>
                <Layout>
                    <NavTiles />
                </Layout>
            </IonContent>
        </IonPage>
    );
};
