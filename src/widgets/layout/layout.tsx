import React from 'react';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import { useSelector } from 'react-redux';

import { SidebarMenu } from '@widgets/sidebar-menu';
import { SensorManager, SensorStatusBar } from '@entities/sensor';
import { appSelectors } from '@app';

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
                            <SensorStatusBar />
                            <div className='layout-body'>
                                <IonRow className='ion-align-items-center'>
                                    {/*
                                        <IonCol size="7.8">
                                            <User />
                                        </IonCol>
                                        <IonCol size="3.3">
                                            <SensorStatus />
                                        </IonCol>
                                    */}
                                </IonRow>

                                <IonRow>
                                    {/* TODO: something strange is here in the size property */}
                                    <IonCol
                                        size={isSidebarVisible ? '7.5' : '11.5'}
                                        className='ion-margin main'
                                    >
                                        {children}
                                    </IonCol>

                                    {isSidebarVisible ? (
                                        <IonCol size='4' className='ion-padding'>
                                            {rightSideBar}
                                        </IonCol>
                                    ) : null}
                                </IonRow>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};
