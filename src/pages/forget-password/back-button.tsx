import React from 'react';
import { NavLink } from 'react-router-dom';
import { IonRow } from '@ionic/react';

import { routesMapping } from '@app/routes';

import './back-button.css';

export const BackButton: React.FunctionComponent = () => {
    return (
        <IonRow>
            <NavLink className='backButton' to={routesMapping.login}>
                Back
            </NavLink>
        </IonRow>
    );
};
