import React from 'react';
import { Link } from 'react-router-dom';
import { IonText } from '@ionic/react';

import { routesMapping } from '@app/routes';
import { classname } from '@shared/utils';

import './nav-tiles.css';

const cn = classname('nav-tiles');

export const NavTiles: React.FunctionComponent = () => {
    return (
        <div className={cn()}>
            <Link className={cn('tab')} to={routesMapping.addMilk}>
                <img
                    src='./img/logo-tile-top.svg'
                    alt='top part of logo'
                    className='logo-tile-top'
                />
                <div className='button-tab ion-float-right'>
                    <img
                        className='icons'
                        src='./icons/milk/add-milk-selected.png'
                        alt='add milk icon'
                    />
                </div>
                <div className='tile-text-wrapper'>
                    <IonText className='ion-text-start'>
                        <h4>
                            Scan 
                            the Barcode or
                            <br />
                            Enter The Milk ID
                        </h4>
                    </IonText>
                    <IonText className='ion-text-start'>
                        <h3>Add Milk</h3>
                    </IonText>
                </div>
            </Link>

            <Link className={cn('tab')} to={routesMapping.analyse}>
                <img
                    src='./img/logo-tile-middle.svg'
                    alt='top part of logo'
                    className='logo-tile-middle'
                />
                <div className='button-tab ion-float-right'>
                    <img
                        className='icons'
                        src='./icons/milk/analyse-milk-selected.png'
                        alt='analyse milk icon'
                    />
                </div>
                <div className='tile-text-wrapper'>
                    <IonText className='ion-text-start'>
                        <h4>
                            Use PREEMIE SENSOR
                            <br />
                            to Analyse
                            <br />
                            Selected Milk
                        </h4>
                    </IonText>
                    <IonText className='ion-text-start'>
                        <h3>Analyse Milk</h3>
                    </IonText>
                </div>
            </Link>

            <Link className={cn('tab')} to={routesMapping.reports}>
                <img
                    src='./img/logo-tile-bottom.svg'
                    alt='top part of logo'
                    className='logo-tile-bottom'
                />
                <div className='button-tab ion-float-right'>
                    <img
                        className='icons'
                        src='./icons/general/view-reports-selected.png'
                        alt='view reports icon'
                    />
                </div>
                <div className='tile-text-wrapper'>
                    <IonText className='ion-text-start'>
                        <h4>
                            Print Bag's Labels
                            <br />
                            or View & Print
                            <br />
                            Milk Reports
                        </h4>
                    </IonText>
                    <IonText className='ion-text-start'>
                        <h3>View Reports</h3>
                    </IonText>
                </div>
            </Link>
        </div>
    );
};
