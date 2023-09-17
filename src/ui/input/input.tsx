import React from 'react';
import { IonInput } from '@ionic/react';

import { mapHandlers } from '@ui/input/utils';

import './input.css';

export type PreemieInputProps = Parameters<typeof IonInput>[0];

export const PreemieInput = React.forwardRef<HTMLIonInputElement, PreemieInputProps>(
    ({ className = '', ...otherProps }, forwardRef) => {
        const inputClassName = ['preemie-input', className].join(' ');

        const { label, placeholder, type, fill, name } = otherProps;
        const handlers = mapHandlers(otherProps);

        return (
            <IonInput
                {...otherProps}
                {...handlers}
                ref={forwardRef}
                className={inputClassName}
                label={label}
                placeholder={placeholder}
                fill={fill}
                type={type}
                id={`custom-input-${name}`}
            />
        );
    },
);
