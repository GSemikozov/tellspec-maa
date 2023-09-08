import React from 'react';
import { IonToast } from '@ionic/react';

import { classname } from '@shared/utils';

import { useSensorConnectionProcess } from '../sensor-connection-process-context';

import './sensor-connection-process-toast.css';

const cn = classname('sensor-connection-process-toast');

const LOADING_STATUSES = ['checkingBle', 'discovering'];

export const SensorConnectionProcessToast: React.FunctionComponent = () => {
    const { status, toastMessage } = useSensorConnectionProcess();

    const isOpen = status !== 'idle';
    const duration = LOADING_STATUSES.includes(status) ? undefined : 6_000;

    return (
        <IonToast
            className={cn('', { error: status === 'error' })}
            isOpen={isOpen}
            message={toastMessage}
            duration={duration}
        />
    );
};
