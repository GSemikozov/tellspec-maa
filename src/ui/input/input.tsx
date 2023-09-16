import React from 'react';
import { IonInput } from '@ionic/react';

import './input.css';

export type PreemieInputProps = Parameters<typeof IonInput>[0];

export const PreemieInput = React.forwardRef<HTMLIonInputElement, PreemieInputProps>(
    ({ className = '', ...otherProps }, forwardRef) => {
        const inputClassName = ['preemie-input', className].join(' ');

        return <IonInput ref={forwardRef} className={inputClassName} {...otherProps} />;
    },
);
