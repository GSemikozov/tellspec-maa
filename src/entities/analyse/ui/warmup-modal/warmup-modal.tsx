import React from 'react';
import { IonButton, IonModal } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { isGivenDateOlderThan } from '@shared/time';
import {
    getSensorStatus,
    selectSensorDeviceActiveCalibration,
    selectSensorDeviceTemperature,
    useWarmupSensor,
} from '@entities/sensor';

import type { AppDispatch } from '@app';

import './warmup-modal.css';

const cn = classname('warmup-modal');

const MAX_TIME_SINCE_LAST_CALIBRATION_MS = 15 * 60 * 1000;

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
    const activeCalibration = useSelector(selectSensorDeviceActiveCalibration);

    const needRecalibration = isGivenDateOlderThan(
        activeCalibration?.['last_modified_at'] ?? '',
        MAX_TIME_SINCE_LAST_CALIBRATION_MS,
    );

    const [warmupSensor, { loading: warmupSensorLoading }] = useWarmupSensor();

    const analyseMilkTitle = isMilkAnalysed ? 'Re-analyse milk' : 'Analyse milk';

    React.useEffect(() => {
        dispatch(getSensorStatus());
    }, []);

    console.log('temperature', temperature);
    console.log('needRecalibration', needRecalibration);

    return (
        <IonModal isOpen={open} onDidDismiss={onClose}>
            <div className={cn()}>
                {temperature < 29 || needRecalibration ? (
                    <>
                        <p>
                            For best results we suggest that you need to warm up your Preemie Sensor
                            before you analyse the milk.
                        </p>

                        <div className={cn('modal-actions')}>
                            <IonButton disabled>{analyseMilkTitle}</IonButton>
                            <IonButton disabled={warmupSensorLoading} onClick={warmupSensor}>
                                Warm Up Sensor
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
