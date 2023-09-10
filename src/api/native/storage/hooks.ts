import React from 'react';

import { nativeStore } from './storage';

export const useSetupStore = () => {
    const [readyStore, setReadyStore] = React.useState(false);

    React.useEffect(() => {
        const setupStore = async () => {
            setReadyStore(false);

            await nativeStore.createStore();

            setReadyStore(true);
        };

        setupStore();
    }, []);

    return readyStore;
};
