import React from 'react';
import { IonInput } from '@ionic/react';

import { mapHandlers } from '@ui/utils';

import './input.css';

export type PreemieInputProps = Parameters<typeof IonInput>[0];

export const PreemieInput = React.forwardRef<HTMLIonInputElement, PreemieInputProps>(
    ({ className = '', ...otherProps }, forwardRef) => {
        const { placeholder, type, fill, children } = otherProps;

        const inputClassName = ['preemie-input', className].join(' ');

        const handlers = mapHandlers(otherProps);

        return children ? (
            <IonInput
                {...otherProps}
                {...handlers}
                ref={forwardRef}
                className={inputClassName}
                placeholder={placeholder}
                fill={fill}
                type={type}
            >
                {children}
            </IonInput>
        ) : (
            <IonInput
                {...otherProps}
                {...handlers}
                ref={forwardRef}
                label={otherProps?.label}
                className={inputClassName}
                placeholder={placeholder}
                fill={fill}
                type={type}
            />
        );
    },
);
