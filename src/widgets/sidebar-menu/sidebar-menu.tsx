import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IonCol, IonGrid, IonItem, IonRow } from '@ionic/react';

import { classname } from '@shared/utils';
import {
    HomeIcon,
    AddMilkIcon,
    AnalyseMilkIcon,
    ReportsIcon,
    SettingsIcon,
    LogoutIcon,
    SensorIcon,
} from '@ui/icons';
import { userAsyncActions } from '@entities/user';
import { routesMapping } from '@app/routes';

import PreemieLogo from '../../../public/img/MAA-logo.png';

import type { AppDispatch } from '@app/store';

import './sidebar-menu.css';

const cn = classname('sidebar-menu');

const MENU_ITEMS = [
    {
        id: 'home',
        title: 'Home',
        to: routesMapping.home,
        icon: <HomeIcon size={32} color='currentColor' />,
    },
    {
        id: 'add-milk',
        title: 'Add Milk',
        to: routesMapping.addMilk,
        icon: <AddMilkIcon size={32} color='currentColor' />,
    },
    {
        id: 'analyse-milk',
        title: 'Analyse Milk',
        to: routesMapping.analyse,
        icon: <AnalyseMilkIcon size={32} color='currentColor' />,
    },
    {
        id: 'reports',
        title: 'Milk Reports',
        to: routesMapping.reports,
        icon: <ReportsIcon size={32} color='currentColor' />,
    },
    {
        id: 'sensor-page',
        title: 'Preemie Sensor',
        to: routesMapping.sensorPage,
        icon: <SensorIcon size={32} color='currentColor' />,
    },
    {
        id: 'settings',
        title: 'Settings',
        to: routesMapping.settings,
        icon: <SettingsIcon size={40} color='currentColor' />,
    },
];

export const SidebarMenu: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { pathname } = useLocation();

    const handleLogout = (event: React.MouseEvent) => {
        event.preventDefault();

        dispatch(userAsyncActions.logout());
    };

    return (
        <div className={cn()}>
            <IonItem className='ion-no-margin' id='menu-logo' lines='none'>
                <img src={PreemieLogo} alt='Preemie Logo' />
            </IonItem>

            <IonGrid className='tabs ion-no-padding'>
                <IonRow>
                    <IonCol>
                        <div className={cn('list')}>
                            {MENU_ITEMS.map(menuItem => (
                                <div
                                    key={menuItem.id}
                                    className={cn('list-item', {
                                        active: pathname === menuItem.to,
                                    })}
                                >
                                    <NavLink to={menuItem.to}>
                                        <div className={cn('list-item-image')}>{menuItem.icon}</div>

                                        <div className={cn('list-item-content')}>
                                            <h4>{menuItem.title}</h4>
                                        </div>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol>
                        <div className={cn('list')}>
                            <div className={cn('list-item')}>
                                <NavLink to={routesMapping.home} onClick={handleLogout}>
                                    <div className={cn('list-item-image')}>
                                        <LogoutIcon size={32} color='currentColor' />
                                    </div>

                                    <div className={cn('list-item-content')}>
                                        <h4>Log out</h4>
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </div>
    );
};
