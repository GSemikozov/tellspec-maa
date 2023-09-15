import React from 'react';
import { IonInput } from '@ionic/react';

import type { TextFieldTypes } from '@ionic/core';

import './input.css';

export interface InputProps {
    label?: string;
    placeholder?: string;
    type?: TextFieldTypes | undefined;
    fill?: 'outline' | 'solid';
    value?: any;
    className?: string;
}

export const CustomInput = React.forwardRef<HTMLIonInputElement, InputProps>((props, ref) => {
    const { label, placeholder, type, fill, value, className } = props;

    return (
        <IonInput
            {...props}
            ref={ref}
            label={label}
            placeholder={placeholder}
            fill={fill}
            type={type}
            value={value}
            className={`custom-input ${className || ''}`}
            id='custom-input'
        />
    );
});
