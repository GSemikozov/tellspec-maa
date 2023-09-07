import React from 'react';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';

import { User } from '@entities/user';
import { SensorManager, SensorStatusBar } from '@entities/sensor';
import { SidebarMenu } from '@widgets/sidebar-menu';

import './layout.css';

interface LayoutProps {
    title?: string;
    children?: React.ReactNode;
    rightSideBar?: React.ReactNode;
}

export const Layout: React.FunctionComponent<LayoutProps> = props => {
    const { children, rightSideBar = <SensorManager /> } = props;

    return (
        <IonPage>
            <IonContent>
                <IonGrid className='ion-no-padding'>
                    <IonRow>
                        <IonCol size='2'>
                            <SidebarMenu />
                        </IonCol>

                        <IonCol size='10'>
                            <div className='layout-body'>
                                <IonRow className='header ion-align-items-center'>
                                    <IonCol size='7' className='header-user'>
                                        <User />
                                    </IonCol>

                                    <IonCol size='5' className='header-sensor-status'>
                                        <SensorStatusBar />
                                    </IonCol>
                                </IonRow>

                                <IonRow>
                                    <IonCol size='7' className='main-container'>
                                        {children}
                                    </IonCol>

                                    <IonCol size='5' className='sensor-container'>
                                        {rightSideBar}
                                    </IonCol>
                                </IonRow>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};
