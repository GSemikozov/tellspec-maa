import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonModal, IonRow, IonSpinner } from '@ionic/react';

import { classname } from '@shared/utils';
import { PreemieButton } from '@ui';
import {
    selectSensorDevice,
    selectSensorDeviceActiveCalibration,
    sensorActions,
} from '@entities/sensor/model';
import { useCalibrateSensor, useSaveCalibrationSensor } from '@entities/sensor/hooks';

import { SensorCalibrationChart } from '../sensor-calibration-chart';

import type { AppDispatch } from '@app';

import './calibration-modal.css';

const cn = classname('calibration-modal');

export const CalibrationModal: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [open, setOpen] = React.useState(false);

    const handleCloseModal = () => setOpen(false);

    const [calibrateSensor, { loading: calibrateSensorLoading, hasError: hasCalibrationError }] =
        useCalibrateSensor({
            onError: async () => {
                handleCloseModal();
            },
        });

    const [saveActiveCalibration, { loading: saveActiveCalibrationLoading }] =
        useSaveCalibrationSensor({
            onComplete: async () => {
                dispatch(sensorActions.acceptSensorCalibration());

                handleCloseModal();
            },
        });

    const currentDevice = useSelector(selectSensorDevice);
    const deviceActiveCalibration = useSelector(selectSensorDeviceActiveCalibration);

    React.useEffect(() => {
        if (hasCalibrationError) {
            setOpen(false);
            return;
        }

        if (calibrateSensorLoading) {
            setOpen(calibrateSensorLoading);
        }
    }, [calibrateSensorLoading, hasCalibrationError]);

    return (
        <IonModal backdropDismiss={false} isOpen={open}>
            <div className={cn()}>
                {calibrateSensorLoading ? (
                    <>
                        <h1>Calibration in progress...</h1>
                        <IonSpinner name='bubbles' color='primary' />
                        <p>
                            Please refrain from touching or interfering with the sensor during
                            calibration, to ensure accurate results. This will take about 20
                            seconds.
                        </p>
                    </>
                ) : null}

                {!calibrateSensorLoading && deviceActiveCalibration ? (
                    <>
                        <p>
                            Calibration is a process to compensate for the sensor drift and changing
                            environmental conditions within the sensor. Your calibration curve (in
                            magenta) should be similar to the factory calibration (in green). If it
                            is not similar then you should re-calibrate or contact us at
                            info@preemiesensor.com.
                        </p>
                        <div className={cn('section-chart', { fluid: true })}>
                            <p>Spectrum of current calibration</p>
                            <div className={cn('chart')}>
                                <SensorCalibrationChart
                                    variant='reference-calibration'
                                    calibration={deviceActiveCalibration}
                                />
                            </div>
                        </div>

                        <div>
                            <IonRow className={cn('actions')}>
                                <PreemieButton
                                    className='calibration-button'
                                    size='small'
                                    loading={saveActiveCalibrationLoading}
                                    onClick={() => saveActiveCalibration(currentDevice)}
                                >
                                    Accept calibration
                                </PreemieButton>

                                <PreemieButton
                                    className='calibration-button'
                                    size='small'
                                    loading={calibrateSensorLoading}
                                    onClick={() => calibrateSensor(currentDevice)}
                                >
                                    Re-calibrate
                                </PreemieButton>

                                {currentDevice ? (
                                    <PreemieButton
                                        className='calibration-button'
                                        size='small'
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </PreemieButton>
                                ) : null}
                            </IonRow>
                        </div>
                    </>
                ) : null}
            </div>
        </IonModal>
    );
};
