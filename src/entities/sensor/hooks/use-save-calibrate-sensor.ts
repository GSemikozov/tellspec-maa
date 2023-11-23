import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { log } from '@shared/utils';
import { usePreemieToast } from '@ui';
import { useEventAsync } from '@shared/hooks';

import {
    SensorDevice,
    saveActiveCalibrationSensor,
    selectIsActiveCalibrationSaveLoading,
} from '../model';

import type { AppDispatch } from '@app';

type UseSaveCalibrationSensorOptions = {
    onComplete?: () => Promise<void>;
};

type UseCalibrateSensorResult = [
    (device: SensorDevice | null) => Promise<void>,
    { loading: boolean },
];

export const useSaveCalibrationSensor = ({
    onComplete,
}: UseSaveCalibrationSensorOptions): UseCalibrateSensorResult => {
    const handleCompleteEvent = useEventAsync(onComplete);

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

                await presentToast({
                    message: 'Start saving active calibration...',
                });

                await dispatch(saveActiveCalibrationSensor()).unwrap();

                await presentToast({
                    type: 'success',
                    message: 'Calibration accepted',
                });

                handleCompleteEvent();
            } catch (error: any) {
                await log('useSaveCalibrationSensor:error', error);

                await presentToast({
                    type: 'error',
                    message: error.message,
                });
            }
        },
        [loading, handleCompleteEvent],
    );

    return [call, { loading }];
};
