import React from 'react';
import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import { useSelector } from 'react-redux';

import { SensorManager } from '@entities/sensor';
import { SidebarMenu } from '@widgets/sidebar-menu';
import { Alert } from '@features/alert';
import { Backdrop } from '@features/backdrop';
import { Header } from '@widgets/header';
import { selectIsSidebarOpen } from '@app/model';

import './layout.css';

interface LayoutProps {
    title?: string;
    children?: React.ReactNode;
    rightSideBar?: React.ReactNode;
}

export const Layout: React.FunctionComponent<LayoutProps> = props => {
    const { children, rightSideBar = <SensorManager /> } = props;

    const sidebarOpen = useSelector(selectIsSidebarOpen);
    const showSidebar = sidebarOpen && rightSideBar;

    return (
        <>
            <IonGrid className='ion-no-padding'>
                <IonContent>
                    <IonRow>
                        <IonCol size='2.5'>
                            <SidebarMenu />
                        </IonCol>

                        <IonCol size='9.5'>
                            <Header />

                            <IonContent>
                                <div className='layout-body'>
                                    <IonRow>
                                        {/* TODO: something strange is here in the size property */}
                                        <IonCol
                                            size={showSidebar ? '7' : '12'}
                                            className='ion-padding main'
                                        >
                                            {children}
                                        </IonCol>

                                        {showSidebar ? (
                                            <IonCol size='5' className='ion-padding'>
                                                {rightSideBar}
                                            </IonCol>
                                        ) : null}
                                    </IonRow>
                                </div>
                            </IonContent>
                        </IonCol>
                    </IonRow>
                </IonContent>
            </IonGrid>
            <Alert />
            <Backdrop />
        </>
    );
};
