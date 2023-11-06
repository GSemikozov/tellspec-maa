import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIonAlert } from '@ionic/react';

import { appActions, appSelectors } from '@app';

import type { AppDispatch } from '@app';

export const Alert: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [presentAlert] = useIonAlert();
    const { alertHeader, alertSubHeader, alertMessage, isAlertVisible } = useSelector(
        appSelectors.getAlert,
    );

    useEffect(() => {
        if (isAlertVisible) {
            presentAlert({
                header: alertHeader,
                subHeader: alertSubHeader,
                message: alertMessage,
                buttons: [
                    {
                        text: 'OK',
                        handler: () => dispatch(appActions.hideAlert()),
                    },
                ],
            });
        }
    }, [isAlertVisible]);

    return null;
};
