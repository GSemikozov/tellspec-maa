import React from 'react';
import { BarcodeScanner as Scanner } from '@ionic-native/barcode-scanner';
import { IonButton, IonIcon, IonItem } from '@ionic/react';

import { PreemieAutocomplete } from '@ui/autocomplete';
import { classname } from '@shared/utils';

import BarCodeSearchIcon from './icons/barcode-search.svg';

import type { BaseAutocompleteItem } from '@ui/autocomplete';

import './barcode-scanner.css';

const cn = classname('barcode-scanner');

export type BarcodeScannerProps = {
    title: string;
    options: BaseAutocompleteItem[];
    value: string;
    onChange: (barcode: string) => void;

    disabled?: boolean;
};

export const BarcodeScanner = React.forwardRef<HTMLIonItemElement, BarcodeScannerProps>(
    ({ title, options, value, disabled, onChange }, forwardRef) => {
        const handleChange = (milkId: string | number) => {
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
            <IonItem lines='none' className={cn('')} ref={forwardRef} disabled={disabled}>
                <PreemieAutocomplete
                    items={options}
                    value={value}
                    onChange={handleChange}
                    InputProps={{
                        label: title,
                        labelPlacement: 'floating',
                    }}
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
