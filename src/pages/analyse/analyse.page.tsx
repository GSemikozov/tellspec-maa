import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

import { Layout } from '@widgets/layout';
import { AnalyseMilkWidget } from '@widgets/analyse-milk-widget';

export const AnalysePage: React.FunctionComponent = () => {
    return (
        <IonPage>
            <IonContent>
                <Layout title='Analyse Milk'>
                    <AnalyseMilkWidget />
                </Layout>
            </IonContent>
        </IonPage>
    );
};
