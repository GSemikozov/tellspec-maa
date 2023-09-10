import React from 'react';
import { IonButton } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import {
    CalibrationStatus,
    calibrateDevice,
    selectSensorCalibrationStatus,
} from '@entities/sensor';
import { useSensorConnectionProcess } from '@widgets/sensor-connection-process';

import { SensorManagerInstructions } from './sensor-manager-instructions';
import { SensorManagerInteractiveImage } from './sensor-manager-interactive-image';

import './sensor-manager.css';
import type { AppDispatch } from '@app';

const cn = classname('sensor-manager');

export const SensorManager: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { onStartDiscovery } = useSensorConnectionProcess();

    const deviceCalibrationStatus = useSelector(selectSensorCalibrationStatus);

    const getInstructions = React.useCallback(() => {
        if (deviceCalibrationStatus === CalibrationStatus.DISCONNECTED) {
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
                            <IonButton onClick={onStartDiscovery}>
                                Start Discovery Devices
                            </IonButton>
                        </div>
                    </>
                ),
            };
        }

        if (deviceCalibrationStatus === CalibrationStatus.REQUIRED) {
            const handleStartCalibration = () => {
                dispatch(calibrateDevice());
            };

            return {
                title: 'Calibration required',
                content: (
                    <>
                        <div className={cn('actions')}>
                            <IonButton onClick={handleStartCalibration}>
                                Start Calibration
                            </IonButton>
                        </div>
                    </>
                ),
            };
        }

        if (deviceCalibrationStatus === CalibrationStatus.PROGRESS) {
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
    }, [deviceCalibrationStatus, onStartDiscovery]);

    const instructions = getInstructions();

    return (
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
    );
};
