import React from 'react';
import { useSelector } from 'react-redux';
import { IonModal, IonRow, IonSpinner } from '@ionic/react';

import { classname } from '@shared/utils';
import { PreemieButton } from '@ui';
import {
    SensorDevice,
    selectSensorDevice,
    selectSensorDeviceActiveCalibration,
} from '@entities/sensor/model';
import { SensorCalibrationChart } from '@entities/sensor/ui';

import './calibration-modal.css';

const cn = classname('calibration-modal');

export type CalibrationModalProps = {
    open: boolean;
    calibrateSensorLoading: boolean;
    saveActiveCalibrationLoading: boolean;
    onCalibrateSensor: (device: SensorDevice | null) => Promise<void>;
    onSaveCalibrationSensor: (device: SensorDevice | null) => Promise<void>;
    onClose: () => void;
};

export const CalibrationModal: React.FunctionComponent<CalibrationModalProps> = ({
    open,
    calibrateSensorLoading,
    saveActiveCalibrationLoading,
    onCalibrateSensor,
    onSaveCalibrationSensor,
    onClose,
}) => {
    const currentDevice = useSelector(selectSensorDevice);
    const deviceActiveCalibration = useSelector(selectSensorDeviceActiveCalibration);

    const handleCalibrateSensor = () => onCalibrateSensor(currentDevice);
    const handleSaveCalibrationSensor = () => onSaveCalibrationSensor(currentDevice);

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
                                    onClick={handleSaveCalibrationSensor}
                                >
                                    Accept calibration
                                </PreemieButton>

                                <PreemieButton
                                    className='calibration-button'
                                    size='small'
                                    loading={calibrateSensorLoading}
                                    onClick={handleCalibrateSensor}
                                >
                                    Re-calibrate
                                </PreemieButton>

                                {currentDevice ? (
                                    <PreemieButton
                                        className='calibration-button'
                                        size='small'
                                        onClick={onClose}
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
