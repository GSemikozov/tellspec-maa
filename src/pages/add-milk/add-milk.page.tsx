import React from 'react';

import { AddMilkForm } from '@features/add-milk-form';
import { Layout } from '@widgets/layout/layout';

export const AddMilkPage: React.FC = () => {
    return (
        <Layout>
            {/* <IonGrid>
          <IonRow>
            <IonCol size='2.5'>
            <SidebarMenu />
            </IonCol>
            <IonCol size='9.5'>

            </IonCol>
            </IonRow>
          </IonGrid> */}
            <AddMilkForm />
        </Layout>
    );
};
