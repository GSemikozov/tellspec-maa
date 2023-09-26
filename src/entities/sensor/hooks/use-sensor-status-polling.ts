import React from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '@app';

import { getSensorStatus } from '../model';

type StartPollingOptions = {
    interval?: number;
};

type UseSensorStatusPollingResult = [
    (options?: StartPollingOptions) => Promise<void>,
    () => void,
    { isPolling: boolean },
];

export const useSensorStatusPolling = ({
    interval: intervalProp = 60 * 1000,
}: StartPollingOptions = {}): UseSensorStatusPollingResult => {
    const dispatch = useDispatch<AppDispatch>();
    const [isPolling, setIsPolling] = React.useState(false);

    const timeoutRef = React.useRef<number | null>(null);

    const start = React.useCallback(
        async ({ interval = intervalProp }: StartPollingOptions = {}) => {
            setIsPolling(true);

            await dispatch(getSensorStatus());

            timeoutRef.current = window.setTimeout(start, interval);
        },
        [intervalProp],
    );

    const stop = React.useCallback(() => {
        if (!timeoutRef.current) {
            return;
        }

        setIsPolling(false);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }, [intervalProp]);

    React.useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);

    return [start, stop, { isPolling }];
};
