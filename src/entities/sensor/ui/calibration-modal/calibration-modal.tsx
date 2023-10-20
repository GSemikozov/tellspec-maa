import React from 'react';
import { useSelector } from 'react-redux';
import { IonModal, IonRow } from '@ionic/react';

import { classname } from '@shared/utils';
import { PreemieButton } from '@ui';
import { selectSensorDevice } from '@entities/sensor/model';
import { useCalibrateSensor, useSaveCalibrationSensor } from '@entities/sensor/hooks';

import { SensorCalibrationChart } from '../sensor-calibration-chart';

import './calibration-modal.css';

const cn = classname('calibration-modal');

export const CalibrationModal: React.FunctionComponent = () => {
    const [open, setOpen] = React.useState(false);

    const handleCloseModal = () => setOpen(false);

    const [calibrateSensor, { loading: calibrateSensorLoading }] = useCalibrateSensor({
        onError: async () => {
            handleCloseModal();
        },
    });

    const [saveActiveCalibration, { loading: saveActiveCalibrationLoading }] =
        useSaveCalibrationSensor({
            onComplete: async () => {
                handleCloseModal();
            },
        });

    const currentDevice = useSelector(selectSensorDevice);
    const activeCalibration = currentDevice?.activeCal;

    React.useEffect(() => {
        if (calibrateSensorLoading) {
            setOpen(calibrateSensorLoading);
        }
    }, [calibrateSensorLoading]);

    return (
        <IonModal backdropDismiss={false} isOpen={open}>
            <div className={cn()}>
                {calibrateSensorLoading ? (
                    <>
                        <h1>Calibration in progress...</h1>
                        <p>
                            Please refrain from touching or interfering with the sensor during
                            calibration, to ensure accurate results. This will take about 20
                            seconds.
                        </p>
                    </>
                ) : null}

                {!calibrateSensorLoading && activeCalibration ? (
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
                                    calibration={activeCalibration}
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
