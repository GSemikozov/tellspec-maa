import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

import { AddMilkForm } from '@features/add-milk-form';
import { Layout } from '@widgets/layout/layout';

export const AddMilkPage: React.FC = () => {
    return (
        <IonPage>
            {/* <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>Add Milk</IonTitle>
        </IonToolbar>
      </IonHeader> */}
            <IonContent className='ion-no-padding'>
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
            </IonContent>
        </IonPage>
    );
};
