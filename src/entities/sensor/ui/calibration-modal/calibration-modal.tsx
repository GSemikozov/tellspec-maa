import React from 'react';
import { useSelector } from 'react-redux';
import { IonModal, IonRow } from '@ionic/react';

import { classname } from '@shared/utils';
import { selectSensorCalibrationLoading, selectSensorDevice } from '@entities/sensor/model';

import './calibration-modal.css';
import { SensorCalibrationChart } from '../sensor-calibration-chart';
import { PreemieButton } from '@ui';

const cn = classname('calibration-modal');

export const CalibrationModal: React.FunctionComponent = () => {
    const isCalibrationLoading = useSelector(selectSensorCalibrationLoading);

    const [open, setOpen] = React.useState(isCalibrationLoading);

    const currentDevice = useSelector(selectSensorDevice);
    const activeCalibration = currentDevice?.activeCal;

  
    React.useEffect(() => {
        setOpen(isCalibrationLoading);
    }, [isCalibrationLoading]);

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

                {/*** TODO: new calibration chart */}

                <div>
                    <IonRow className={cn('actions')}>
                        <PreemieButton
                            className='button'
                            size='small'
                            onClick={() => console.log('accept calibration click')}
                        >
                            {'accept calibration'}
                        </PreemieButton>

                        <PreemieButton
                            className='button'
                            size='small'
                            onClick={() => console.log('re-calibrate click')}
                        >
                            {'Re-calibrate'}
                        </PreemieButton>

                        {currentDevice ? (
                            <PreemieButton
                                className='button'
                                size='small'
                                onClick={() => console.log('cancel click')}
                            >
                                {'Cancel'}
                            </PreemieButton>
                        ) : null}
                    </IonRow>
                </div>
            </div>
        </IonModal>
    );
};
