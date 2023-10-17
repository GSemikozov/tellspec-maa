import React from 'react';
import { useSelector } from 'react-redux';
import { IonModal, IonRow } from '@ionic/react';

import { classname } from '@shared/utils';
import {
    selectSensorCalibrationLoading,
    selectSensorCalibrationReady,
    selectSensorDevice,
} from '@entities/sensor/model';
import { PreemieButton } from '@ui';

import { SensorCalibrationChart } from '../sensor-calibration-chart';

import './calibration-modal.css';

const cn = classname('calibration-modal');

export const CalibrationModal: React.FunctionComponent = () => {
    const isCalibrationLoading = useSelector(selectSensorCalibrationLoading);
    const isCalibrationReady = useSelector(selectSensorCalibrationReady);

    const [open, setOpen] = React.useState(isCalibrationLoading);
    const [isNewCalibration, setNewCalibration] = React.useState(false);

    const currentDevice = useSelector(selectSensorDevice);
    const activeCalibration = currentDevice?.activeCal;

    React.useEffect(() => {
        setOpen(isCalibrationLoading);
    }, [isCalibrationLoading]);

    React.useEffect(() => {
        !isCalibrationLoading && isCalibrationReady && setNewCalibration(true);
    }, [isCalibrationReady]);

    return (
        <IonModal backdropDismiss={false} isOpen={open}>
            <div className={cn()}>
                <h1>Calibration in process...</h1>
                <p>
                    Please refrain from touching or interfering with the sensor during calibration,
                    to ensure accurate results. This will take about 20 seconds.
                </p>

                {activeCalibration ? (
                    <>
                        <div className={cn('section-chart', { fluid: true })}>
                            <p>Spectrum of last calibration</p>
                            <div className={cn('chart')}>
                                <SensorCalibrationChart
                                    variant='reference-calibration'
                                    calibration={activeCalibration}
                                />
                            </div>
                        </div>
                    </>
                ) : null}

                {isNewCalibration && (
                    /*** TODO: new calibration chart */
                    <div>
                        <IonRow className={cn('actions')}>
                            <PreemieButton
                                className='calibration-button'
                                size='small'
                                onClick={() => console.log('accept calibration click')}
                            >
                                {'accept calibration'}
                            </PreemieButton>

                            <PreemieButton
                                className='calibration-button'
                                size='small'
                                onClick={() => console.log('re-calibrate click')}
                            >
                                {'Re-calibrate'}
                            </PreemieButton>

                            {currentDevice ? (
                                <PreemieButton
                                    className='calibration-button'
                                    size='small'
                                    onClick={() => console.log('cancel click')}
                                >
                                    {'Cancel'}
                                </PreemieButton>
                            ) : null}
                        </IonRow>
                    </div>
                )}
            </div>
        </IonModal>
    );
};
