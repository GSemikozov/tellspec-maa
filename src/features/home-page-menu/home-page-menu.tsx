import React from 'react';
import { useDispatch } from 'react-redux';
import { IonCol, IonGrid, IonItem, IonRow, IonTabBar, IonTabButton, IonText } from '@ionic/react';
import { useHistory } from 'react-router';

import { userAsyncActions } from '@entities/user';
import { Logo } from '@ui';
import './home-page.menu.css';

import type { AppDispatch } from '@app/store';

export const HomePageMenu: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const handleLogout = () => {
        dispatch(userAsyncActions.logout());
    };

    return (
        <>
            <div className='main-body'>
                <IonItem className='ion-no-margin' id='menu-logo' lines='none'>
                    <Logo />
                </IonItem>
                <IonGrid className='tabs ion-no-padding'>
                    <IonRow>
                        <IonCol>
                            <IonTabBar>
                                <IonTabButton tab='home' href='/'>
                                    <div className='menu-icon-tab ion-text-start'>
                                        <img
                                            src='../../../resources/home-icon-selected.png'
                                            className='ion-float-left ion-padding-right'
                                        />
                                        <h4>
                                            <IonText color='primary'>Home</IonText>
                                        </h4>
                                    </div>
                                </IonTabButton>
                            </IonTabBar>
                            <IonTabBar>
                                <IonTabButton
                                    tab='addMilk'
                                    href='/'
                                    onClick={() => history.push('/add-milk')}
                                >
                                    <div className='menu-icon-tab ion-text-start'>
                                        <img
                                            src='../../../resources/add-milk-notSelected.png'
                                            className='ion-float-left ion-padding-right'
                                        />
                                        <h4>
                                            <IonText color='tertiary'>Add Milk</IonText>
                                        </h4>
                                    </div>
                                </IonTabButton>
                            </IonTabBar>
                            <IonTabBar>
                                <IonTabButton tab='analyseMilk' href='/'>
                                    <div className='menu-icon-tab ion-text-start'>
                                        <img
                                            src='../../../resources/analyse-milk-notSelected.png'
                                            className='ion-float-left'
                                        />
                                        <h4>
                                            <IonText color='tertiary'>Analyse Milk</IonText>
                                        </h4>
                                    </div>
                                </IonTabButton>
                            </IonTabBar>
                            <IonTabBar>
                                <IonTabButton tab='reports' href='/'>
                                    <div className='menu-icon-tab ion-text-start'>
                                        <img
                                            src='../../../resources/view-reports-notSelected.png'
                                            className='ion-float-left'
                                        />
                                        <h4>
                                            <IonText color='tertiary'>View Reports</IonText>
                                        </h4>
                                    </div>
                                </IonTabButton>
                            </IonTabBar>
                            <IonTabBar>
                                <IonTabButton tab='settings' href='/'>
                                    <div className='menu-icon-tab ion-text-start'>
                                        <img
                                            src='../../../resources/settings-icon-notSelected.png'
                                            className='ion-float-left ion-padding-right'
                                        />
                                        <h4>
                                            <IonText color='tertiary'>Settings</IonText>
                                        </h4>
                                    </div>
                                </IonTabButton>
                            </IonTabBar>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonTabBar>
                                <IonTabButton tab='settings' href='/' onClick={handleLogout}>
                                    <div className='menu-icon-tab ion-text-start'>
                                        <img
                                            src='../../../resources/logout-icon-notSelected.png'
                                            className='ion-float-left ion-padding-right'
                                        />
                                        <h4>
                                            <IonText color='tertiary'>Log out</IonText>
                                        </h4>
                                    </div>
                                </IonTabButton>
                            </IonTabBar>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </div>
        </>
    );
};
