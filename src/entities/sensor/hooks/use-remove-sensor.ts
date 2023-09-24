import React from 'react';
import { useDispatch } from 'react-redux';

import { usePreemieToast } from '@ui';
import { useEvent } from '@shared/hooks';
import { AppDispatch } from '@app';

import { removeDevice } from '../model';

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

    const call = React.useCallback(async (deviceUuid: string) => {
        try {
            setLoading(true);

            await dispatch(removeDevice(deviceUuid)).unwrap();

            handleCompleteEvent();
        } catch (error) {
            console.error('[removeSensor]:', error);

            await dismissToast();
            await presentToast({
                type: 'error',
                message: 'An error occurred during unpairing',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    return [call, { loading }];
};
