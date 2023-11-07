import React from 'react';
import { IonModal, IonCheckbox } from '@ionic/react';

import { PreemieButton } from '@ui';
import { classname } from '@shared/utils';

import './sensor-analyse-instructions-modal.css';

const cn = classname('sensor-analyse-instructions-modal');

export type SensorAnalyseInstructionsModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (isPreventInstructions: boolean) => void;
};

export const SensorAnalyseInstructionsModal: React.FunctionComponent<
    SensorAnalyseInstructionsModalProps
> = ({ open, onClose, onSubmit }) => {
    const [preventInstructions, setPreventInstructions] = React.useState(false);

    const handleChangePreventInstructions = () => setPreventInstructions(prevState => !prevState);

    const handleClick = () => {
        onSubmit(preventInstructions);
    };

    return (
        <IonModal backdropDismiss={false} isOpen={open} onDidDismiss={onClose}>
            <div className={cn()}>
                <div className={cn('header')}>Now you are ready to analyse milk</div>
                <div className={cn('main')}></div>

                <div className={cn('actions')}>
                    <IonCheckbox
                        labelPlacement='end'
                        value={preventInstructions}
                        onIonChange={handleChangePreventInstructions}
                    >
                        Do not show these instructions again today
                    </IonCheckbox>
                </div>

                <div className={cn('actions')}>
                    <PreemieButton onClick={handleClick}>OK</PreemieButton>
                </div>
            </div>
        </IonModal>
    );
};
