import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

import { AddMilkForm } from '@features/add-milk-form';
import { Layout } from '@widgets/layout/layout';

export const AddMilkPage: React.FunctionComponent = () => {
    return (
        <IonPage>
            <IonContent>
                <Layout>
                    <AddMilkForm />
                </Layout>
            </IonContent>
        </IonPage>
    );
};
