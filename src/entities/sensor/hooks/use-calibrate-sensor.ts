import React from 'react';
import { useDispatch } from 'react-redux';

import { usePreemieToast } from '@ui';
import { tellspecRetrieveDeviceConnect } from '@api/native';
import { AppDispatch } from '@app';

import { SensorDevice, calibrateSensorDevice } from '../model';
import { isSensorDisconnectedError } from '../helpers';

type UseCalibrateSensorResult = [
    (device: SensorDevice | null) => Promise<void>,
    { loading: boolean },
];

export const useCalibrateSensor = (): UseCalibrateSensorResult => {
    const dispatch = useDispatch<AppDispatch>();

    const [presentToast, dismissToast] = usePreemieToast();

    const [loading, setLoading] = React.useState(false);

    const call = React.useCallback(async (device: SensorDevice | null) => {
        try {
            await tellspecRetrieveDeviceConnect(device?.uuid ?? '');

            setLoading(true);

            await presentToast({
                message: 'Start calibration...',
            });

            await dispatch(calibrateSensorDevice()).unwrap();
        } catch (error: any) {
            console.error('[calibrateSensor]:', error);

            let errorMessage = 'An error occurred during calibration';

            if (isSensorDisconnectedError(error)) {
                errorMessage = error.message;
            }

            await dismissToast();
            await presentToast({
                type: 'error',
                message: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    return [call, { loading }];
};
