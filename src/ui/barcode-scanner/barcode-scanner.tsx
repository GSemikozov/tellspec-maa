import { forwardRef } from 'react';
import { BarcodeScanner as Scanner } from '@ionic-native/barcode-scanner';
import { IonButton, IonIcon, IonInput, IonItem } from '@ionic/react';

import BarCodeSearchIcon from './icons/barcode-search.svg';

export interface BarcodeScannerProps {
    title: string;
    value?: string;
    onChange?: (barcode: string) => void;
}

export const BarcodeScanner = forwardRef<HTMLIonInputElement, BarcodeScannerProps>((props, ref) => {
    const { title, value, onChange } = props;

    const handleChange = (e: any) => {
        const { value } = e.target as HTMLInputElement;
        const barcode = value.trim();

        onChange && onChange(barcode);
    };

    const openScanner = async () => {
        try {
            const data = await Scanner.scan();
            onChange && onChange(data.text);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <IonItem lines='none'>
            <IonInput
                ref={ref}
                type='text'
                label={title}
                value={value}
                label-placement='floating'
                onIonInput={handleChange}
            />
            <IonButton slot='end' fill='clear' onClick={openScanner} style={{ margin: '0' }}>
                <IonIcon icon={BarCodeSearchIcon} />
            </IonButton>
        </IonItem>
    );
});
