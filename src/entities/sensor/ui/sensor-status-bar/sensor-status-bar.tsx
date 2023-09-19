import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { usePreemieToast } from '@shared/ui';
import { BatteryFullIcon, BatteryOfflineIcon, BluetoohIcon, TargetOfflineIcon } from '@ui/icons';
import { BleStatus, selectBleStatus } from '@app/model';
import {
    selectSensorCalibrationLoading,
    selectSensorCalibrationRequired,
    selectSensorCalibrationReady,
    calibrateSensorDevice,
    selectSensorCalibrationDisconnected,
} from '@entities/sensor/model';
import {
    SensorConnectionProcessStatus,
    useSensorConnectionProcess,
} from '@widgets/sensor-connection-process';

import './sensor-status-bar.css';

import type { AppDispatch } from '@app';
import { PluginListenerHandle } from '@capacitor/core';
import { IonButton } from '@ionic/react';

const cn = classname('sensor');

export const SensorStatusBar: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [presentToast] = usePreemieToast();

    const bleStatus = useSelector(selectBleStatus);

    const calibrationRequired = useSelector(selectSensorCalibrationRequired);
    const calibrationLoading = useSelector(selectSensorCalibrationLoading);
    const calibrationReady = useSelector(selectSensorCalibrationReady);

    const { status: sensorConnectionProcessStatus } = useSensorConnectionProcess();

    const bleStatusOn = bleStatus === BleStatus.ON;
    const devicePaired =
        sensorConnectionProcessStatus === SensorConnectionProcessStatus.PAIRING_SUCCESS;

    const batteryIcon = React.useMemo(() => {
        if (devicePaired) {
            return <BatteryFullIcon />;
        }

        return <BatteryOfflineIcon />;
    }, [devicePaired]);

    const statusTitle = React.useMemo(() => {
        if (!devicePaired) {
            if (bleStatusOn) {
                return 'Please connect a sensor';
            }
        }

        if (devicePaired) {
            if (calibrationRequired) {
                return 'Please sensor calibration is needed';
            }

            if (calibrationLoading) {
                return 'Please wait, the sensor is calibrating';
            }

            return 'The sensor is connected & ready';
        }

        return 'Turn on and connect a sensor';
    }, [bleStatusOn, devicePaired, calibrationRequired, calibrationLoading]);

    const handleClickTargetIcon = async () => {
        if (calibrationRequired || calibrationReady) {
            try {
                await dispatch(calibrateSensorDevice()).unwrap();
            } catch (error) {
                console.error('[handleClickTargetIcon]:', error);

                await presentToast({
                    type: 'error',
                    message: 'An error occurred during calibration',
                });
            }
        }

        return;
    };

    return (
        <div className={cn()}>
            <div className={cn('status')}>{statusTitle}</div>

            <div className={cn('status-icons')}>
                <TargetOfflineIcon
                    className={cn('target-icon', {
                        'required-calibration': calibrationRequired,
                        'progress-calibration': calibrationLoading,
                        clickable: calibrationRequired || calibrationReady,
                    })}
                    onClick={handleClickTargetIcon}
                />

                {batteryIcon}

                <BluetoohIcon
                    className={cn('bluetooth-icon', {
                        enabled: !devicePaired && bleStatusOn,
                        connected: devicePaired,
                    })}
                />
            </div>
        </div>
    );
};
