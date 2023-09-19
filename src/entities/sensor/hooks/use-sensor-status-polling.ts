import React from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '@app';

import { getSensorStatus } from '../model';

type UseSensorStatusPollingOptions = {
    interval?: number;
    skip?: boolean;
};

export const useSensorStatusPolling = ({
    // default interval = 5min
    interval = 5 * 60 * 1000,
    skip,
}: UseSensorStatusPollingOptions) => {
    const dispatch = useDispatch<AppDispatch>();

    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        const resetTimeout = () => {
            if (!timeoutRef.current) {
                return;
            }

            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        };

        if (skip) {
            resetTimeout();
            return;
        }

        const startPolling = async () => {
            console.log('start polling');
            await dispatch(getSensorStatus());

            timeoutRef.current = setTimeout(startPolling, interval);
        };

        startPolling();

        return () => {
            resetTimeout();
        };
    }, [interval, skip]);
};
