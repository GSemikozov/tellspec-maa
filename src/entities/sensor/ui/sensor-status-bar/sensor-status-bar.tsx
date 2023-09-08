import React from 'react';

import { BatteryOfflineIcon, BluetoohIcon, TargetOfflineIcon } from '@ui/icons';
import { classname } from '@shared/utils';

import './sensor-status-bar.css';

const cn = classname('sensor');

export const SensorStatusBar: React.FunctionComponent = () => {
    return (
        <div className={cn()}>
            <div className={cn('status')}>Turn on and connect a sensor</div>

            <div className={cn('status-icons')}>
                <TargetOfflineIcon />
                <BatteryOfflineIcon />
                <BluetoohIcon />
            </div>
        </div>
    );
};
