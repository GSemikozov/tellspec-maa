import React from 'react';

import { Layout } from '@widgets/layout';
import { AnalyseMilkWidget } from '@widgets/analyse-milk-widget';
import { IonPage } from '@ionic/react';

export const AnalysePage: React.FunctionComponent = () => {
    return (
        <IonPage>
            <Layout title='Analyse Milk'>
                <AnalyseMilkWidget />
            </Layout>
        </IonPage>
    );
};
