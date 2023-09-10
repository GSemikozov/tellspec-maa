import React from 'react';
import { IonButton } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

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

import { SensorManagerInstructions } from './sensor-manager-instructions';
import { SensorManagerInteractiveImage } from './sensor-manager-interactive-image';
import { SensorManagerToast } from './sensor-manager-toast';

import './sensor-manager.css';
import type { AppDispatch } from '@app';

const cn = classname('sensor-manager');

export const SensorManager: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { status: sensorConnectionProcessStatus, onStartDiscovery } =
        useSensorConnectionProcess();

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
                title: 'Connect a sensor',
                content: (
                    <>
                        <p>
                            To turn on your Preemie Sensor, locate the power switch on the side of
                            the device. Slide the switch to the ON position (to the right). You will
                            notice the green power LED illuminated on the top of the sensor. All of
                            the LEDs flash briefly to show that they are working.
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
    ]);

    const instructions = getInstructions();

    return (
        <>
            <div className={cn()}>
                {instructions ? (
                    <SensorManagerInstructions
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
