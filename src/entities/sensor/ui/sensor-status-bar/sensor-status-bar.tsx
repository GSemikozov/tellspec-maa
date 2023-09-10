import React from 'react';
import { useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { BatteryFullIcon, BatteryOfflineIcon, BluetoohIcon, TargetOfflineIcon } from '@ui/icons';
import { BleStatus, selectBleStatus } from '@app/model';
import {
    selectSensorCalibrationLoading,
    selectSensorCalibrationRequired,
} from '@entities/sensor/model';
import {
    SensorConnectionProcessStatus,
    useSensorConnectionProcess,
} from '@widgets/sensor-connection-process';

import './sensor-status-bar.css';

const cn = classname('sensor');

export const SensorStatusBar: React.FunctionComponent = () => {
    const bleStatus = useSelector(selectBleStatus);

    const calibrationRequired = useSelector(selectSensorCalibrationRequired);
    const calibrationLoading = useSelector(selectSensorCalibrationLoading);

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

    return (
        <div className={cn()}>
            <div className={cn('status')}>Turn on and connect a sensor</div>

            <div className={cn('status-icons')}>
                <TargetOfflineIcon
                    className={cn('target-icon', {
                        'required-calibration': calibrationRequired,
                        'progress-calibration': calibrationLoading,
                    })}
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
