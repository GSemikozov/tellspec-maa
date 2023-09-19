import React from 'react';
import { useDispatch } from 'react-redux';

import { usePreemieToast } from '@shared/ui';
import { AppDispatch } from '@app';

import { calibrateSensorDevice } from '../model';

type UseCalibrateSensorResult = [() => Promise<void>, { loading: boolean }];

export const useCalibrateSensor = (): UseCalibrateSensorResult => {
    const dispatch = useDispatch<AppDispatch>();

    const [presentToast, dismissToast] = usePreemieToast();

    const [loading, setLoading] = React.useState(false);

    const call = React.useCallback(async () => {
        try {
            setLoading(true);

            await presentToast({
                message: 'Start calibration...',
            });

            await dispatch(calibrateSensorDevice()).unwrap();
        } catch (error: any) {
            console.error('[calibrateSensor]:', error);

            await dismissToast();

            await presentToast({
                type: 'error',
                message: 'An error occurred during calibration',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    return [call, { loading }];
};
