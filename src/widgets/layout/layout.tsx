import React from 'react';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import { useSelector } from 'react-redux';

import { appSelectors } from '@app';
import { SensorManager } from '@entities/sensor';
import { SidebarMenu } from '@widgets/sidebar-menu';
import { Header } from '@widgets/header';
import { Alert } from '@features/alert';
import { Backdrop } from '@features/backdrop';

import './layout.css';

interface LayoutProps {
    title?: string;
    children?: React.ReactNode;
    rightSideBar?: React.ReactNode;
}

export const Layout: React.FunctionComponent<LayoutProps> = props => {
    const { children, rightSideBar = <SensorManager /> } = props;

    const isSidebarVisible = useSelector(appSelectors.isSidebarVisible);

    return (
        <IonPage>
            <IonContent>
                <IonGrid className='ion-no-padding'>
                    <IonRow>
                        <IonCol size='2.5'>
                            <SidebarMenu />
                        </IonCol>

                        <IonCol size='9.5'>
                            <Header />

                            <div className='layout-body'>
                                <IonRow>
                                    {/* TODO: something strange is here in the size property */}
                                    <IonCol
                                        size={isSidebarVisible ? '7' : '12'}
                                        className='ion-padding main'
                                    >
                                        {children}
                                    </IonCol>

                                    {isSidebarVisible ? (
                                        <IonCol size='5' className='ion-padding'>
                                            {rightSideBar}
                                        </IonCol>
                                    ) : null}
                                </IonRow>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            <Alert />
            <Backdrop />
        </IonPage>
    );
};
