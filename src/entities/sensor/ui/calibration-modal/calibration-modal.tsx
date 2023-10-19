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
    const [calibrateSensor, { loading: calibrateSensorLoading }] = useCalibrateSensor();

    const [saveActiveCalibration, { loading: saveActiveCalibrationLoading }] =
        useSaveCalibrationSensor();

    const [open, setOpen] = React.useState(calibrateSensorLoading);

    const handleCloseModal = () => setOpen(false);

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
                        <h1>Calibration in process...</h1>
                        <p>
                            Please refrain from touching or interfering with the sensor during
                            calibration, to ensure accurate results. This will take about 20
                            seconds.
                        </p>
                    </>
                ) : null}

                {activeCalibration ? (
                    <>
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
