import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { log } from '@shared/utils';
import { usePreemieToast } from '@ui';
import { useEventAsync } from '@shared/hooks';

import {
    warmupSensorDevice,
    selectIsWarmupSensorLoading,
    selectSensorDeviceTemperature,
} from '../model';
import { isSensorDisconnectedError } from '../helpers';



import type { AppDispatch } from '@app';

type UseWarmupSensorOptions = {
    onComplete?: () => Promise<void>;
};

type UseWarmupSensorResult = [() => Promise<void>, { loading: boolean }];

export const useWarmupSensor = ({
    onComplete,
}: UseWarmupSensorOptions = {}): UseWarmupSensorResult => {
    const handleCompleteEvent = useEventAsync(onComplete);

    const dispatch = useDispatch<AppDispatch>();

    const [presentToast] = usePreemieToast();

    const loading = useSelector(selectIsWarmupSensorLoading);
    const currentSensorTemperature = useSelector(selectSensorDeviceTemperature);

    const currentSensorTemperatureRef = React.useRef<number>(0);

  

    {
        currentSensorTemperatureRef.current = currentSensorTemperature;
    }

    const call = React.useCallback(async () => {
        try {
          

        if (loading) {
                return;
            }

            await presentToast({
                message: 'Start warmup sensor...',
            });

            await dispatch(warmupSensorDevice()).unwrap();

            const message =
                currentSensorTemperatureRef.current < 30
                    ? 'Your Preemie Sensor still needs to be warmed again, please select the warm-up button again.'
                    : 'The sensor warmed up successfully';

            await presentToast({
                type: 'success',
                message,
            });

            handleCompleteEvent();
        } catch (error: any) {
            await log('useWarmupSensor:error', error);

            let errorMessage = error.message;

            if (isSensorDisconnectedError(error)) {
                errorMessage = error.message;
            }

            await presentToast({
                type: 'error',
                message: errorMessage,
            });
        }
    }, [loading, handleCompleteEvent]);

    return [call, { loading }];
};
