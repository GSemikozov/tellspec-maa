import React from 'react';
import { useSelector } from 'react-redux';
import { IonModal, IonRow, IonSpinner } from '@ionic/react';

import { classname } from '@shared/utils';
import { NativeStorageKeys, nativeStore } from '@api/native';
import { PreemieButton } from '@ui';
import {
    SensorDevice,
    selectSensorDevice,
    selectSensorDeviceActiveCalibration,
    SensorCalibrationChart,
} from '@entities/sensor';

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
    const [isFirstCalibration, setIsFirstCalibration] = React.useState(true);

    const currentDevice = useSelector(selectSensorDevice);
    const deviceActiveCalibration = useSelector(selectSensorDeviceActiveCalibration);

    const handleCalibrateSensor = () => onCalibrateSensor(currentDevice);
    const handleSaveCalibrationSensor = () => onSaveCalibrationSensor(currentDevice);

    React.useEffect(() => {
        const run = async () => {
            const isFirstCalibration =
                (await nativeStore.get(NativeStorageKeys.IS_FIRST_SENSOR_CALIBRATION)) ?? {};

            setIsFirstCalibration(Boolean(isFirstCalibration.value));
        };

        run();
    }, [open]);

    return (
        <>
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

                    {!calibrateSensorLoading ? (
                        <>
                            <p>
                                Calibration is a process to compensate for the sensor drift and
                                changing environmental conditions within the sensor. Your
                                calibration curve (in magenta) should be similar to the factory
                                calibration (in green). If it is not similar then you should
                                re-calibrate or contact us at info@preemiesensor.com.
                            </p>

                            {deviceActiveCalibration ? (
                                <div className={cn('section-chart', { fluid: true })}>
                                    <p>Spectrum of current calibration</p>
                                    <div className={cn('chart')}>
                                        <SensorCalibrationChart
                                            variant='reference-calibration'
                                            calibration={deviceActiveCalibration}
                                        />
                                    </div>
                                </div>
                            ) : null}

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

                                    {!isFirstCalibration && deviceActiveCalibration ? (
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
        </>
    );
};
