import React from 'react';

type Handler = (...args: any[]) => any;
type AsyncHandler = (...args: any[]) => Promise<any>;

export const useEvent = <T extends Handler>(fn: T) => {
    const fnRef = React.useRef<T | null>(null);

    React.useLayoutEffect(() => {
        fnRef.current = fn;
    });

    return React.useCallback(
        ((...args) => {
            if (fnRef.current) {
                return fnRef.current(...args);
            }
        }) as T,
        [],
    );
};

export const useEventAsync = <T extends AsyncHandler>(fn: T) => {
    const fnRef = React.useRef<T | null>(null);

    React.useLayoutEffect(() => {
        fnRef.current = fn;
    });

    return React.useCallback(
        (async (...args) => {
            if (fnRef.current) {
                return fnRef.current(...args);
            }
        }) as T,
        [],
    );
};
