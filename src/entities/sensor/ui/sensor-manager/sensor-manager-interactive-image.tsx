import React from 'react';
import { useSelector } from 'react-redux';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import { classname } from '@shared/utils';
import { BleStatus, selectBleStatus } from '@app/model';
import { selectSensorCalibrationLoading } from '@entities/sensor/model';
import {
    SensorConnectionProcessStatus,
    useSensorConnectionProcess,
} from '@widgets/sensor-connection-process';

import './sensor-manager-interactive-image.css';

const cn = classname('sensor-manager-interactive-image');

export const SensorManagerInteractiveImage: React.FunctionComponent = () => {
    const bleStatus = useSelector(selectBleStatus);
    const calibrationLoading = useSelector(selectSensorCalibrationLoading);

    const { status: sensorConnectionProcessStatus } = useSensorConnectionProcess();

    const [playingCountdown, setPlayingCountdown] = React.useState(false);

    React.useEffect(() => {
        setPlayingCountdown(calibrationLoading);
    }, [calibrationLoading]);

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

            {playingCountdown ? (
                <div className={cn('calibration-progress')}>
                    <CountdownCircleTimer
                        isPlaying
                        size={32}
                        duration={90}
                        trailStrokeWidth={0}
                        strokeWidth={2}
                        strokeLinecap='square'
                        rotation='counterclockwise'
                        colors='#e503b0'
                    >
                        {countdownCircleTimerProps => (
                            <span>{countdownCircleTimerProps.remainingTime}</span>
                        )}
                    </CountdownCircleTimer>
                </div>
            ) : null}
        </div>
    );
};
