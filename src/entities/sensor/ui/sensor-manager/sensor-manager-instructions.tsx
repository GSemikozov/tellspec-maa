import React from 'react';
import { IonModal } from '@ionic/react';

import './sensor-manager-instructions.css';

type SensorManagerInstructionsProps = {
    title: string;
    children: React.ReactNode;
};

export const SensorManagerInstructions: React.FunctionComponent<SensorManagerInstructionsProps> = ({
    title,
    children,
}) => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <div className='sensor-manager-instructions' onClick={() => setOpen(true)}>
                <div className='sensor-manager-instructions__title'>{title}</div>
                <div className='sensor-manager-instructions__content'>{children}</div>
            </div>

            <IonModal showBackdrop isOpen={open} onDidDismiss={() => setOpen(false)}>
                asdasd
            </IonModal>
        </>
    );
};
