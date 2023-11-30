import { IonModal } from '@ionic/react';
import { PreemieButton } from '@ui';

import './before-calibration-modal.css';

import { classname } from '@shared/utils';

const cn = classname('before-calibration-modal');

export const BeforeCalibrationModal = () => {
    return (
        <IonModal isOpen={false}>
            <div className={cn()}>
                <h1>The sensor needs calibration.
                    Please be sure that there is nothing in the sample well, and do not disturb the
                    sensor during calibration.
                </h1>
                <PreemieButton className={cn('button')}>OK</PreemieButton>
            </div>
        </IonModal>
    );
};
