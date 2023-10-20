import React from 'react';
import { IonButton, IonModal } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { getSensorStatus, selectSensorDeviceTemperature, useWarmupSensor } from '@entities/sensor';

import type { AppDispatch } from '@app';

import './warmup-modal.css';

const cn = classname('warmup-modal');

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
    const dispatch = useDispatch<AppDispatch>();

    const temperature = useSelector(selectSensorDeviceTemperature);

    const [warmupSensor, { loading: warmupSensorLoading }] = useWarmupSensor();

    const analyseMilkTitle = isMilkAnalysed ? 'Re-analyse milk' : 'Analyse milk';

    React.useEffect(() => {
        dispatch(getSensorStatus());
    }, []);

    return (
        <IonModal isOpen={open} onDidDismiss={onClose}>
            <div className={cn()}>
                {temperature < 29.0 ? (
                    <>
                        <p>
                            For best results we suggest that you need to warm up your Preemie Sensor
                            before you analyse the milk.
                        </p>

                        <div className={cn('modal-actions')}>
                            <IonButton disabled>{analyseMilkTitle}</IonButton>
                            <IonButton disabled={warmupSensorLoading} onClick={warmupSensor}>
                                Warm Up sensor
                            </IonButton>
                            <IonButton onClick={onClose}>Cancel</IonButton>
                        </div>
                    </>
                ) : (
                    <div className={cn('second-modal-actions')}>
                        <IonButton disabled={analyseMilkLoading} onClick={onAnalyseMilk}>
                            {analyseMilkTitle}
                        </IonButton>

                        <IonButton onClick={onClose}>Cancel</IonButton>
                    </div>
                )}
            </div>
        </IonModal>
    );
};
