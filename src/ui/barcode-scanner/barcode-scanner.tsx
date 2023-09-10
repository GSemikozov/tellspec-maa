import React from 'react';
import { BarcodeScanner as Scanner } from '@ionic-native/barcode-scanner';
import { IonButton, IonIcon, IonInput, IonItem } from '@ionic/react';

import { classname } from '@shared/utils';

import './barcode-scanner.css';

import BarCodeSearchIcon from './icons/barcode-search.svg';

import type { IonInputCustomEvent, InputInputEventDetail } from '@ionic/core';

const cn = classname('barcode-scanner');

export interface BarcodeScannerProps {
    title: string;
    value?: string;
    onChange?: (barcode: string) => void;
}

export const BarcodeScanner = React.forwardRef<HTMLIonInputElement, BarcodeScannerProps>(
    ({ title, value, onChange }, forwardRef) => {
        const handleChange = (event: IonInputCustomEvent<InputInputEventDetail>) => {
            const { value } = event.target;

            if (!value) {
                return;
            }

            const barcode = String(value).trim();

            if (onChange) {
                onChange(barcode);
            }
        };

        const handleOpenScanner = async () => {
            try {
                const data = await Scanner.scan();

                if (onChange) {
                    onChange(data.text);
                }
            } catch (e) {
                console.error(e);
            }
        };

        return (
            <IonItem lines='none' className={cn('')}>
                <IonInput
                    ref={forwardRef}
                    type='text'
                    label={title}
                    value={value}
                    label-placement='floating'
                    onIonInput={handleChange}
                />

                <IonButton
                    fill='clear'
                    className={cn('scanner-button')}
                    onClick={handleOpenScanner}
                >
                    <IonIcon icon={BarCodeSearchIcon} />
                </IonButton>
            </IonItem>
        );
    },
);
