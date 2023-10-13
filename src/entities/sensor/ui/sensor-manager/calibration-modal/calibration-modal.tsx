import React from 'react';
import { IonButton, IonModal } from '@ionic/react';
import { classname } from '@shared/utils';

import './calibration-modal.css'
import { LogoAnimation } from '@ui/logo/animated-logo';

const cn = classname('calibration-modal')

type CalibrationModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const CalibrationModal: React.FunctionComponent<CalibrationModalProps> = props => {
    const { isOpen, onClose } = props;
    return (
        <IonModal isOpen={isOpen} onIonModalDidDismiss={onClose}>
            <div className={cn()}>
                <h1>Calibration in process...</h1>
                <p>
                    Please refrain from touching or interfering with the sensor during this brief
                    calibration process. Your cooperation ensures accurate measurements. This will
                    only take around 20 seconds.
                </p>
                <LogoAnimation />
            </div>
                {/* <IonButton onClick={onClose}>Close</IonButton> */}
        </IonModal>
    );
};
