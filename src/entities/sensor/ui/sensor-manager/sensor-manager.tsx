import React from 'react';
import { IonButton } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';
import { SensorEvent } from 'tellspec-sensor-sdk/src';

import { classname } from '@shared/utils';
import {
    calibrateDevice,
    removeDevice,
    selectSensorCalibrationDisconnected,
    selectSensorCalibrationLoading,
    selectSensorCalibrationRequired,
} from '@entities/sensor';
import {
    SensorConnectionProcessStatus,
    useSensorConnectionProcess,
} from '@widgets/sensor-connection-process';
import { PreemieToast } from '@shared/ui';
import { tellspecAddListener } from '@api/native';

import { SensorManagerInstructions } from './sensor-manager-instructions';
import { SensorManagerInteractiveImage } from './sensor-manager-interactive-image';
import { SensorManagerToast } from './sensor-manager-toast';

import './sensor-manager.css';

import type { PluginListenerHandle } from '@capacitor/core';
import type { AppDispatch } from '@app';

const cn = classname('sensor-manager');

export const SensorManager: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        status: sensorConnectionProcessStatus,
        onStartDiscovery,
        onResetStatus,
    } = useSensorConnectionProcess();

    const [scannerStatusListener, setScannerStatusListener] =
        React.useState<PluginListenerHandle | null>(null);

    const [hasUnpairedError, setHasUnpairedError] = React.useState(false);

    const calibrationDisconnected = useSelector(selectSensorCalibrationDisconnected);
    const calibrationRequired = useSelector(selectSensorCalibrationRequired);
    const calibrationLoading = useSelector(selectSensorCalibrationLoading);

    const getInstructions = React.useCallback(() => {
        if (calibrationDisconnected) {
            const discovering = [
                SensorConnectionProcessStatus.CHECKING_BLE,
                SensorConnectionProcessStatus.DISCOVERING,
                SensorConnectionProcessStatus.CHOOSE_DISCOVERED_DEVICE,
                SensorConnectionProcessStatus.PAIRING_DISCOVERED_DEVICE,
            ].includes(sensorConnectionProcessStatus);

            return {
                title: 'Connect a Preemie sensor',
                content: (
                    <>
                        <p>
                            If this is the first time you are using the Preemie Sensor, please click
                            to see photos that explains how the sensor is turned on.
                        </p>

                        <div className={cn('actions')}>
                            <IonButton disabled={discovering} onClick={onStartDiscovery}>
                                Start Discovery Devices
                            </IonButton>
                        </div>
                    </>
                ),
            };
        }

        if (calibrationRequired) {
            const handleStartCalibration = () => {
                dispatch(calibrateDevice());
            };

            const handleRemoveDevice = async () => {
                try {
                    await dispatch(removeDevice()).unwrap();
                    onResetStatus();
                } catch {
                    setHasUnpairedError(true);
                }
            };

            return {
                title: 'Calibration required',
                content: (
                    <>
                        <div className={cn('actions')}>
                            <IonButton onClick={handleStartCalibration}>
                                Start Calibration
                            </IonButton>

                            <IonButton onClick={handleRemoveDevice}>Unpair Device</IonButton>
                        </div>
                    </>
                ),
            };
        }

        if (calibrationLoading) {
            return {
                title: 'Calibration in Progress',
                content: (
                    <>
                        <p>
                            Please refrain from touching or interfering with the sensor during this
                            brief calibration process. Your cooperation ensures accurate
                            measurements. This will only take around 90 seconds.
                        </p>
                    </>
                ),
            };
        }

        return null;
    }, [
        sensorConnectionProcessStatus,
        calibrationDisconnected,
        calibrationRequired,
        calibrationLoading,
        onStartDiscovery,
        onResetStatus,
    ]);

    React.useEffect(() => {
        if (scannerStatusListener === null) {
            setScannerStatusListener(
                tellspecAddListener(SensorEvent.SCANNER_STATUS, (data: any) => {
                    console.log('[scanner status listener]', JSON.stringify(data));
                }),
            );
        }

        return () => {
            if (scannerStatusListener) {
                scannerStatusListener.remove();
            }
        };
    }, []);

    const instructions = getInstructions();

    return (
        <>
            <div className={cn()}>
                {instructions ? (
                    <SensorManagerInstructions
                        highlight={calibrationLoading}
                        title={instructions.title}
                        className={cn('instructions')}
                    >
                        {instructions.content}
                    </SensorManagerInstructions>
                ) : null}

                <SensorManagerInteractiveImage />
            </div>

            <SensorManagerToast />

            <PreemieToast isOpen={hasUnpairedError} message='An error occurred during unpairing' />
        </>
    );
};
