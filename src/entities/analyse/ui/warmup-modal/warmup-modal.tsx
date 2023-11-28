import React from 'react';
import { IonModal, useIonAlert, IonSpinner } from '@ionic/react';
import { useSelector } from 'react-redux';

import { NativeStorageKeys, nativeStore } from '@api/native';
import { PreemieButton } from '@ui/button';
import { classname } from '@shared/utils';
import { selectSensorDeviceTemperature, useWarmupSensor } from '@entities/sensor';

import './warmup-modal.css';

const cn = classname('warmup-modal');

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

    const [isFirstWarmup, setIsFirstWarmup] = React.useState<boolean | null>(null);

    const commitSetFirstWarmup = React.useCallback(async (value: boolean) => {
        await nativeStore.set(NativeStorageKeys.IS_FIRST_WARMUP, value);
        setIsFirstWarmup(value);
    }, []);

    const currentSensorTemperature = useSelector(selectSensorDeviceTemperature);

    const [warmupSensor, forceCancelWarmupSensor, { loading: warmupSensorLoading }] =
        useWarmupSensor({
            onComplete: async () => {
                commitSetFirstWarmup(false);
            },
        });

    const analyseMilkTitle = isMilkAnalysed ? 'Re-analyse milk' : 'Analyse milk';

    const handleCancelWarmup = React.useCallback(() => {
        if (!isFirstWarmup) {
            forceCancelWarmupSensor();
            onClose();

            return;
        }

        if (currentSensorTemperature < RECOMMENDED_TEMP_FOR_SCAN) {
            presentAlert({
                header: 'Warning',
                subHeader:
                    'For best results we suggest that you need to warm up your Preemie Sensor before you analyse the milk.',
                buttons: [
                    {
                        text: 'OK',
                        handler: () => {
                            commitSetFirstWarmup(false);
                            forceCancelWarmupSensor();
                        },
                    },
                ],
                onDidDismiss: () => {
                    commitSetFirstWarmup(false);
                },
            });
        }
    }, [isFirstWarmup, currentSensorTemperature, commitSetFirstWarmup]);

    React.useEffect(() => {
        const retrieveIsFirstWarmupFromStorage = async () => {
            const isFirstWarmup = await nativeStore.get(NativeStorageKeys.IS_FIRST_WARMUP);

            setIsFirstWarmup(isFirstWarmup);
        };

        retrieveIsFirstWarmupFromStorage();
    }, []);

    const renderContent = React.useMemo(() => {
        if (!isFirstWarmup) {
            return null;
        }

        if (currentSensorTemperature < RECOMMENDED_TEMP_FOR_SCAN) {
            const currentTemperatureString = `Current temperature of the sensor is ${currentSensorTemperature}C`;

            const isDisabledAnalyse = warmupSensorLoading || analyseMilkLoading;

            return (
                <>
                    {analyseMilkLoading || warmupSensorLoading ? (
                        <div className={cn('loading')}>
                            <IonSpinner name='bubbles' color='primary' />
                        </div>
                    ) : null}

                    <p>
                        For best results we suggest that you need to warm up your Preemie Sensor
                        before you analyse the milk.
                    </p>

                    {currentSensorTemperature > 0 ? <p>{currentTemperatureString}</p> : null}

                    <div className={cn('modal-actions')}>
                        <PreemieButton disabled={isDisabledAnalyse} onClick={onAnalyseMilk}>
                            {analyseMilkTitle}
                        </PreemieButton>

                        <PreemieButton disabled={warmupSensorLoading} onClick={warmupSensor}>
                            Warm Up Sensor
                        </PreemieButton>

                        <PreemieButton onClick={handleCancelWarmup}>Cancel</PreemieButton>
                    </div>
                </>
            );
        }
    }, [isFirstWarmup, analyseMilkLoading, warmupSensorLoading, handleCancelWarmup]);

    return (
        <IonModal isOpen={open} onDidDismiss={onClose}>
            <div className={cn()}>{renderContent}</div>
        </IonModal>
    );
};
