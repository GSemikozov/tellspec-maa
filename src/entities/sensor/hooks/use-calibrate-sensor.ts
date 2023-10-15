import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIonRouter } from '@ionic/react';

import { log } from '@shared/utils';
import { usePreemieToast } from '@ui';
import { routesMapping } from '@app/routes';

import { SensorDevice, calibrateSensorDevice, selectSensorCalibrationLoading } from '../model';
import { isSensorDisconnectedError } from '../helpers';

import type { AppDispatch } from '@app';

type UseCalibrateSensorResult = [
    (device: SensorDevice | null) => Promise<void>,
    { loading: boolean },
];

export const useCalibrateSensor = (): UseCalibrateSensorResult => {
    const router = useIonRouter();

    const dispatch = useDispatch<AppDispatch>();

    const [presentToast] = usePreemieToast();

    const isCalibrationLoading = useSelector(selectSensorCalibrationLoading);

    const call = React.useCallback(
        async (device: SensorDevice | null) => {
            try {
                if (isCalibrationLoading) {
                    return;
                }

                router.push(routesMapping.sensorPage);

                await log('useCalibrateSensor:device', device);

                await presentToast({ message: 'Start calibration...' });

                await dispatch(calibrateSensorDevice()).unwrap();
            } catch (error: any) {
                await log('useCalibrateSensor:error', error);

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
        [isCalibrationLoading],
    );

    return [call, { loading: isCalibrationLoading }];
};
