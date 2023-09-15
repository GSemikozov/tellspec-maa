import React from 'react';
import { BarcodeScanner as Scanner } from '@ionic-native/barcode-scanner';
import { IonButton, IonIcon, IonItem, IonSelect, IonSelectOption } from '@ionic/react';

import { classname } from '@shared/utils';

import BarCodeSearchIcon from './icons/barcode-search.svg';

import type { IonSelectCustomEvent, SelectChangeEventDetail } from '@ionic/core';

import './barcode-scanner.css';

const cn = classname('barcode-scanner');

export type BarcodeScannerOption = {
    title: string;
    value: string;
};

export type BarcodeScannerProps = {
    title: string;
    options: BarcodeScannerOption[];
    value: string;
    onChange: (barcode: string) => void;
};

export const BarcodeScanner = React.forwardRef<HTMLIonSelectElement, BarcodeScannerProps>(
    ({ title, options, value, onChange }, forwardRef) => {
        const handleChange = (event: IonSelectCustomEvent<SelectChangeEventDetail>) => {
            const { value: milkId } = event.target;

            if (!milkId) {
                return;
            }

            if (onChange) {
                onChange(String(milkId).trim());
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
                <IonSelect
                    placeholder='Milk Id'
                    labelPlacement='floating'
                    ref={forwardRef}
                    label={title}
                    value={value}
                    onIonChange={handleChange}
                >
                    {options.map(option => (
                        <IonSelectOption key={option.value} value={option.value}>
                            {option.title}
                        </IonSelectOption>
                    ))}
                </IonSelect>

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
