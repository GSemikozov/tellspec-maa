import { IonCheckbox, IonModal } from '@ionic/react';
import { PreemieButton } from '@ui';
import { classname } from '@shared/utils';

import './analysis-modal.css';
import { useState } from 'react';

const cn = classname('analysis-modal');

export const AnalysisModal = ({isOpen, close}) => {
    // const [open, setOpen] = useState(true);

    // const handleClose = () => setOpen(false);

    return (
        <IonModal isOpen={isOpen}>
            <div className={cn('title')}>
                <h1>Now you are ready to analyse milk.</h1>
                <h2>
                    To ensure best results from the analysis, please perform these steps in this
                    order:
                </h2>
            </div>
            <div className={cn()}>
                <ol>
                    <h3>
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
                    </h3>
                </ol>
            </div>
            <div className={cn('actions')}>
                <IonCheckbox labelPlacement='end'>
                    <h3>Do not show these instructions again today.</h3>
                </IonCheckbox>
                <PreemieButton className={cn('actions-button')} onClick={close}>
                    OK
                </PreemieButton>
            </div>
        </IonModal>
    );
};
