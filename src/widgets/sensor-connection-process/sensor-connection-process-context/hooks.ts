import React from 'react';

import { SensorConnectionProcessContext } from './sensor-connection-process-context';

export const useSensorConnectionProcess = () => {
    const context = React.useContext(SensorConnectionProcessContext);

    if (typeof context === 'undefined') {
        throw Error('sensor connection process context is not defined');
    }

    return context;
};
