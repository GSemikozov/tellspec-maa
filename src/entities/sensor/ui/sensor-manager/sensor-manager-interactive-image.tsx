import React from 'react';
import { useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { BleStatus, selectBleStatus } from '@app/model';
import {
    SensorConnectionProcessStatus,
    useSensorConnectionProcess,
} from '@widgets/sensor-connection-process';

import './sensor-manager-interactive-image.css';

const cn = classname('sensor-manager-interactive-image');

type SensorManagerInteractiveImageProps = {
    status?: any;
};

export const SensorManagerInteractiveImage: React.FunctionComponent<
    SensorManagerInteractiveImageProps
> = () => {
    const bleStatus = useSelector(selectBleStatus);

    const { status: sensorConnectionProcessStatus } = useSensorConnectionProcess();

    const bleStatusOn = bleStatus === BleStatus.ON;
    const devicePaired =
        sensorConnectionProcessStatus === SensorConnectionProcessStatus.PAIRING_SUCCESS;

    return (
        <div className={cn()}>
            <img src='./img/sensor.png' alt='sensor-manager-interactive-image' />

            <div className={cn('status-bar')}>
                <div
                    className={cn('status-bar-item', {
                        power: devicePaired,
                    })}
                />

                <div
                    className={cn('status-bar-item', {
                        bluetooth: bleStatusOn,
                        pulse: devicePaired,
                    })}
                />

                <div className={cn('status-bar-item', { scan: false })} />
                <div className={cn('status-bar-item', { battery: false })} />
            </div>
        </div>
    );
};
