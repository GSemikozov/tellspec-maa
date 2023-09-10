import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonBackdrop } from '@ionic/react';

import { appActions, appSelectors } from '@app';

import type { AppDispatch } from '@app';

import './backdrop.css';

export const Backdrop: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isBackdropVisible, backdropText, delay } = useSelector(appSelectors.getBackdrop);

    useEffect(() => {
        if (isBackdropVisible) {
            setTimeout(() => dispatch(appActions.hideBackdrop()), delay);
        }
    }, [isBackdropVisible]);

    if (!isBackdropVisible) {
        return null;
    }

    return (
        <>
            <IonBackdrop />
            <div className='backdrop-box'>{backdropText}</div>
        </>
    );
};
