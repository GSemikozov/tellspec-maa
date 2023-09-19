import React from 'react';
import { useSelector } from 'react-redux';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import { classname } from '@shared/utils';
import { BleStatus, selectBleStatus } from '@app/model';
import {
    selectSensorCalibrationLoading,
    selectIsSensorScanning,
    selectSensorDevice,
    selectSensorDeviceBatteryLevel,
} from '@entities/sensor/model';

import './sensor-manager-interactive-image.css';

const cn = classname('sensor-manager-interactive-image');

export const SensorManagerInteractiveImage: React.FunctionComponent = () => {
    const bleStatus = useSelector(selectBleStatus);

    const currentDevice = useSelector(selectSensorDevice);
    const batteryLevel = useSelector(selectSensorDeviceBatteryLevel);
    const calibrationLoading = useSelector(selectSensorCalibrationLoading);

    const sensorScanningProgress = useSelector(selectIsSensorScanning);

    const [playingCountdown, setPlayingCountdown] = React.useState(false);

    React.useEffect(() => {
        setPlayingCountdown(calibrationLoading);
    }, [calibrationLoading]);

    const bleStatusOn = bleStatus === BleStatus.ON;
    const devicePaired = currentDevice !== null;

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

                <div
                    className={cn('status-bar-item', {
                        scan: sensorScanningProgress,
                        pulse: true,
                    })}
                />

                <div className={cn('status-bar-item', { battery: batteryLevel < 35 })} />
            </div>

            {playingCountdown ? (
                <div className={cn('calibration-progress')}>
                    <CountdownCircleTimer
                        isPlaying
                        size={32}
                        duration={5}
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
