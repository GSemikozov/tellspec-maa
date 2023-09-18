import React from 'react';
import { IonCol, IonContent, IonGrid, IonItem, IonPage, IonRow } from '@ionic/react';

import { Logo } from '@ui';

interface LoginLayoutProps {
    children: React.ReactNode;
    headerSlot?: React.ReactNode;
}

export const LoginLayout: React.FunctionComponent<LoginLayoutProps> = props => {
    const { children, headerSlot } = props;

    return (
        <IonPage>
            <IonContent>
                <IonGrid className='ion-no-padding'>
                    <IonRow>
                        <IonCol size='8'>
                            <IonItem lines='none' className='ion-no-padding'>
                                <img
                                    src='/img/login-screen-hero.jpg'
                                    alt='milk bottle picture'
                                    id='img-login-screen'
                                />
                            </IonItem>
                        </IonCol>

                        <IonCol size='4'>
                            <div className='logo-login-screen'>
                                <Logo />
                            </div>

                            <div className='ion-margin-top ion-margin-bottom ion-margin-horizontal ion-text-center'>
                                {headerSlot}
                            </div>

                            {children}

                            <p className='rights'>
                                <small>© 2021-2023 TellSpec LTD All right Reserved</small>
                            </p>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};
