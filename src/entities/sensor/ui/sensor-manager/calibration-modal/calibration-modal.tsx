import { IonModal } from '@ionic/react';

export const CalibrationModal = (isOpen, onClose) => {
    return (
        <IonModal isOpen={isOpen} onIonModalDidDismiss={onClose}>
            <h1>Calibration in process...</h1>
            <p>
                Please refrain from touching or interfering with the sensor during this brief
                calibration process. Your cooperation ensures accurate measurements. This will only
                take around 90 seconds.
            </p>
        </IonModal>
    );
};
