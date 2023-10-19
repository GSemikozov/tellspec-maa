import { classname } from '@shared/utils';
import { IonButton, IonModal } from '@ionic/react';

import { useSelector } from 'react-redux';
import { selectSensorDevice } from '@entities/sensor';

import './warmup-modal.css';
import { useState } from 'react';

const cn = classname('warmup-modal');

export const WarmupModal = () => {
    const currentDevice = useSelector(selectSensorDevice);
    const currentSensorTemperature =
        currentDevice?.activeCal?.scan['scan-info'].dlp_header.temperature;

    const [isOpen, setIsOpen] = useState(true);
    const handleCloseModal = () => setIsOpen(false);

    return (
        <IonModal isOpen={isOpen}>
            <div className={cn()}>
                {currentSensorTemperature !== undefined && currentSensorTemperature < 29.0 ? (
                    <>
                        <p>
                            For best results we suggest that you need to warm-up your Preemie Sensor
                            before you analyse the milk.
                        </p>
                        <div className={cn('modal-actions')}>
                            <IonButton> Analyse Milk</IonButton>
                            <IonButton> Warm-Up sensor</IonButton>
                            <IonButton> Cancel</IonButton>
                        </div>
                    </>
                ) : (
                    <div className={cn('second-modal-actions')}>
                        <IonButton> Analyse Milk</IonButton>
                        <IonButton onClick={handleCloseModal}> Cancel</IonButton>
                    </div>
                )}
            </div>
        </IonModal>
    );
};
