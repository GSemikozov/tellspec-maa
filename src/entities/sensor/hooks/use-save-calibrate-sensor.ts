import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { log } from '@shared/utils';
import { usePreemieToast } from '@ui';

import {
    SensorDevice,
    saveActiveCalibrationSensor,
    selectIsActiveCalibrationSaveLoading,
} from '../model';
import { isSensorDisconnectedError } from '../helpers';

import type { AppDispatch } from '@app';

type UseCalibrateSensorResult = [
    (device: SensorDevice | null) => Promise<void>,
    { loading: boolean },
];

export const useSaveCalibrationSensor = (): UseCalibrateSensorResult => {
    const dispatch = useDispatch<AppDispatch>();

    const [presentToast] = usePreemieToast();

    const loading = useSelector(selectIsActiveCalibrationSaveLoading);

    const call = React.useCallback(
        async (device: SensorDevice | null) => {
            try {
                if (loading) {
                    return;
                }

                await log('useSaveCalibrationSensor:device', device);

                await presentToast({ message: 'Start saving active calibration...' });

                await dispatch(saveActiveCalibrationSensor()).unwrap();
            } catch (error: any) {
                await log('useSaveCalibrationSensor:error', error);

                let errorMessage = error.message;

                if (isSensorDisconnectedError(error)) {
                    errorMessage = error.message;
                }

                await presentToast({
                    type: 'error',
                    message: errorMessage,
                });
            }
        },
        [loading],
    );

    return [call, { loading }];
};
