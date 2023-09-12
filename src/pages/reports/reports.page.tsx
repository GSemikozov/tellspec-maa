import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

import { ReportsWidget } from '@widgets/reports-widget';
import { Layout } from '@widgets/layout';

import './reports.page.css';

export const ReportsPage: React.FunctionComponent = () => {
    return (
        <IonPage>
            <IonContent>
                <Layout rightSideBar={null}>
                    <ReportsWidget />
                </Layout>
            </IonContent>
        </IonPage>
    );
};
