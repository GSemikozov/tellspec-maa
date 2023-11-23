import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { usePreemieToast } from '@ui';
import { useEvent } from '@shared/hooks';
import { AppDispatch } from '@app';
import { tellspecRetrieveDeviceConnect } from '@api/native';

import { removeDevice, selectSensorDevice } from '../model';
import { isSensorDisconnectedError } from '../errors';

type UseRemoveSensorOptions = {
    onComplete?: () => void | Promise<void>;
};

type UseRemoveSensorResult = [(deviceUuid: string) => Promise<void>, { loading: boolean }];

export const useRemoveSensor = ({
    onComplete,
}: UseRemoveSensorOptions = {}): UseRemoveSensorResult => {
    const dispatch = useDispatch<AppDispatch>();

    const handleCompleteEvent = useEvent(onComplete);

    const [presentToast, dismissToast] = usePreemieToast();

    const [loading, setLoading] = React.useState(false);

    const currentDevice = useSelector(selectSensorDevice);

    const call = React.useCallback(
        async (deviceUuid: string) => {
            try {
                await tellspecRetrieveDeviceConnect(deviceUuid);

                setLoading(true);

                await dispatch(removeDevice(deviceUuid)).unwrap();

                handleCompleteEvent();
            } catch (error: any) {
                console.error('[removeSensor]:', error);

                let errorMessage = 'An error occurred during unpairing';

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
        },
        [currentDevice],
    );

    return [call, { loading }];
};
