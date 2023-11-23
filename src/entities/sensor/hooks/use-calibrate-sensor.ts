import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIonRouter } from '@ionic/react';

import { log } from '@shared/utils';
import { usePreemieToast } from '@ui';
import { routesMapping } from '@app/routes';
import { useEventAsync } from '@shared/hooks';

import {
    SensorDevice,
    calibrateSensorDevice,
    selectSensorCalibrationLoading,
    selectSensorCalibrationError,
    getSensorCalibration,
} from '../model';

import type { AppDispatch } from '@app';

type UseCalibrateSensorOptions = {
    onError?: () => Promise<void>;
};

type UseCalibrateSensorResult = [
    (device: SensorDevice | null) => Promise<void>,
    { loading: boolean; hasError?: boolean },
];

export const useCalibrateSensor = ({
    onError,
}: UseCalibrateSensorOptions = {}): UseCalibrateSensorResult => {
    const handleErrorEvent = useEventAsync(onError);

    const router = useIonRouter();

    const dispatch = useDispatch<AppDispatch>();

    const [presentToast] = usePreemieToast();

    const isCalibrationLoading = useSelector(selectSensorCalibrationLoading);
    const isCalibrationError = useSelector(selectSensorCalibrationError);

    const call = React.useCallback(
        async (device: SensorDevice | null) => {
            try {
                if (isCalibrationLoading) {
                    return;
                }

                router.push(routesMapping.sensorPage);

                await log('useCalibrateSensor:device', device);

                // await presentToast({ message: 'Start calibration...' });

                await dispatch(calibrateSensorDevice()).unwrap();
                await dispatch(getSensorCalibration()).unwrap();
            } catch (error: any) {
                await log('useCalibrateSensor:error', error);

                await presentToast({
                    type: 'error',
                    message: error.message,
                });

                handleErrorEvent();
            }
        },
        [isCalibrationLoading],
    );

    return [call, { loading: isCalibrationLoading, hasError: isCalibrationError }];
};
