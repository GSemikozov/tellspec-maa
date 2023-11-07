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
                <div className={cn('header')}>
                    <h2>Now you are ready to analyse milk.</h2>
                    <h3>
                        To ensure best results from the analysis, please perform these steps in this
                        order:
                    </h3>
                </div>

                <div className={cn('main')}>
                    <ol>
                        <li>
                            Thaw the sample in a refrigerator (2-6ºC, 35-43ºF) or in a cold water
                            bath (10-20º C, 50-68º F).
                        </li>
                        <li>
                            Heat the sample to 40ºC (105ºF) in a water or bead bath, and keep it
                            there until ready to homogenise and analyse.
                        </li>
                        <li>Be sure that room is at 19ºC to 25ºC (66º to 77ºF).</li>
                        <li>The sensor may need a warmup. You will be prompted.</li>
                        <li>
                            Ultrasonically homogenise the milk sample for 3 periods of 5 seconds.
                        </li>
                        <li>
                            Analyse the sample immediately or keep the sample in the water bath
                            until analysis, for a maximum of 15 minutes.
                        </li>
                        <li>
                            Put a drop or two of milk into the cuvette. Ensure there are no bubbles
                            when it is closed.
                        </li>
                        <li>
                            Put the cuvette into the well on the Preemie Sensor and tap OK or press
                            the scan button on the sensor.
                        </li>
                    </ol>
                </div>

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
