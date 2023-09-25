import React from 'react';
import { Link } from 'react-router-dom';
import { IonText } from '@ionic/react';

import { routesMapping } from '@app/routes';
import { classname } from '@shared/utils';

import {LogoAnimation} from '../../../public/animations/Logo-animation.tsx'

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
                            To add a human milk sample into database
                            <br />
                            you select this icon and you can either
                            <br />
                            scan the bracode or enter the milk ID
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
                            To analyse a selected human milk sample
                            <br />
                            you select this icon and use the Preemie Sensor
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
                            Select this icon to print a label to be attached to a
                            <br />
                            human milk container or to view and print
                            <br />
                            the analysis obtained for one or more human milk samples
                        </h4>
                    </IonText>
                    <IonText className='ion-text-start'>
                        <h3>Milk Analyses</h3>
                    </IonText>
                </div>
            </Link>
          <LogoAnimation />
        </div>
    );
};
