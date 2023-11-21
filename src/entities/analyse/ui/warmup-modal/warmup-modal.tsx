import React from 'react';
import { IonModal, IonSpinner, useIonAlert } from '@ionic/react';
import { useSelector } from 'react-redux';

import { PreemieButton } from '@ui/button';
import { classname } from '@shared/utils';
import {
    selectSensorDevice,
    selectSensorDeviceTemperature,
    useWarmupSensor,
} from '@entities/sensor';

import './warmup-modal.css';

const cn = classname('warmup-modal');

const SENSOR_IDLE_MINUTES_TO_RE_WARMUP = 15;
const RECOMMENDED_TEMP_FOR_SCAN = 30;

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
    const [presentAlert] = useIonAlert();

    const [disabledAnalyse, setDisabledAnalyse] = React.useState(true);

    const currentDevice = useSelector(selectSensorDevice);
    const currentSensorTemperature = useSelector(selectSensorDeviceTemperature);

    const currentTime = +new Date();
    const lastSensorInteractionTime = currentDevice?.lastInteractionAt ?? 0;

    const needRecalibration =
        (currentTime - lastSensorInteractionTime) / (60 * 1000) >= SENSOR_IDLE_MINUTES_TO_RE_WARMUP;

    const [warmupSensor, forceCancelWarmupSensor, { loading: warmupSensorLoading }] =
        useWarmupSensor({
            onComplete: async () => {
                setDisabledAnalyse(false);
            },
        });

    const analyseMilkTitle = isMilkAnalysed ? 'Re-analyse milk' : 'Analyse milk';

    const handleCancelWarmup = () => {
        if (currentSensorTemperature < RECOMMENDED_TEMP_FOR_SCAN) {
            presentAlert({
                header: 'Warning',
                subHeader:
                    'For best results we suggest that you need to warm up your Preemie Sensor before you analyse the milk.',
                buttons: [
                    {
                        text: 'OK',
                        handler: () => {
                            setDisabledAnalyse(false);
                            forceCancelWarmupSensor();
                        },
                    },
                ],
            });
        }
    };

    return (
        <IonModal isOpen={open} onDidDismiss={onClose}>
            <div className={cn()}>
                {warmupSensorLoading ? (
                    <div style={{ marginTop: '20rem', textAlign: 'center' }}>
                        <IonSpinner name='bubbles' color='primary' />
                    </div>
                ) : null}

                {currentSensorTemperature < RECOMMENDED_TEMP_FOR_SCAN || needRecalibration ? (
                    <>
                        <p>
                            For best results we suggest that you need to warm up your Preemie Sensor
                            before you analyse the milk.
                        </p>

                        <div className={cn('modal-actions')}>
                            <PreemieButton
                                disabled={disabledAnalyse || warmupSensorLoading}
                                onClick={onAnalyseMilk}
                            >
                                {analyseMilkTitle}
                            </PreemieButton>

                            <PreemieButton disabled={warmupSensorLoading} onClick={warmupSensor}>
                                Warm Up Sensor
                            </PreemieButton>

                            {disabledAnalyse ? (
                                <PreemieButton onClick={handleCancelWarmup}>Cancel</PreemieButton>
                            ) : (
                                <PreemieButton onClick={onClose}>Cancel</PreemieButton>
                            )}
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
