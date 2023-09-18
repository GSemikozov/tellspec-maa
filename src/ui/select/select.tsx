import React from 'react';
import { IonSelect } from '@ionic/react';

import './select.css';

export type PreemieSelectProps = Parameters<typeof IonSelect>[0];

export const PreemieSelect = React.forwardRef<HTMLIonSelectElement, PreemieSelectProps>(
    ({ className = '', ...otherProps }, forwardRef) => {
        const selectClassName = ['preemie-select', className].join(' ');

        return <IonSelect ref={forwardRef} className={selectClassName} {...otherProps} />;
    },
);
