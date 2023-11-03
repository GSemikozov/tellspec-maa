import React from 'react';
import { IonButton, IonModal, IonSpinner } from '@ionic/react';
import { useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import {
    selectSensorDevice,
    selectSensorDeviceTemperature,
    useWarmupSensor,
} from '@entities/sensor';

import './warmup-modal.css';
import { PreemieButton } from '@ui/button';

const cn = classname('warmup-modal');

const SENSOR_IDLE_MINUTES_TO_RE_WARMUP = 15;

export type WarmupModalProps = {
    open: boolean;
    analyseMilkLoading: boolean;
    onClose: () => void;
    onAnalyseMilk: () => Promise<void>;

    isMilkAnalysed?: boolean;
};

export const WarmupModal: React.FunctionComponent<WarmupModalProps> = ({
    open,
    analyseMilkLoading,
    onAnalyseMilk,
    onClose,

    isMilkAnalysed,
}) => {
    const currentDevice = useSelector(selectSensorDevice);
    const currentSensorTemperature = useSelector(selectSensorDeviceTemperature);

    const currentTime = +new Date();
    const lastSensorInteractionTime = currentDevice?.lastInteractionAt ?? 0;

    const needRecalibration =
        (currentTime - lastSensorInteractionTime) / (60 * 1000) >= SENSOR_IDLE_MINUTES_TO_RE_WARMUP;

    const [warmupSensor, { loading: warmupSensorLoading }] = useWarmupSensor();

    const analyseMilkTitle = isMilkAnalysed ? 'Re-analyse milk' : 'Analyse milk';

    return (
        <IonModal isOpen={open} onDidDismiss={onClose}>
            <div className={cn()}>
                {warmupSensorLoading && (
                    <div style={{ marginTop: '20rem', textAlign: 'center' }}>
                        <IonSpinner name='bubbles' color='primary' />
                    </div>
                )}
                {currentSensorTemperature < 30 || needRecalibration ? (
                    <>
                        <p>
                            For best results we suggest that you need to warm up your Preemie Sensor
                            before you analyse the milk.
                        </p>

                        <div className={cn('modal-actions')}>
                            <PreemieButton disabled>{analyseMilkTitle}</PreemieButton>
                            <PreemieButton disabled={warmupSensorLoading} onClick={warmupSensor}>
                                Warm Up Sensor
                            </PreemieButton>
                            <IonButton onClick={onClose}>Cancel</IonButton>
                        </div>
                    </>
                ) : (
                    <div className={cn('second-modal-actions')}>
                        <PreemieButton disabled={analyseMilkLoading} onClick={onAnalyseMilk}>
                            {analyseMilkTitle}
                        </PreemieButton>

                        <PreemieButton onClick={onClose}>Cancel</PreemieButton>
                    </div>
                )}
            </div>
        </IonModal>
    );
};
