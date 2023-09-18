import React from 'react';
import { IonModal } from '@ionic/react';

import { PreemieInput } from '@ui/input';
import { classname } from '@shared/utils';

import { AutocompleteTypehead } from './autocomplete-typehead';

import type { PreemieInputProps } from '@ui/input';
import type { BaseAutocompleteItem } from './types';

import './autocomplete.css';

const cn = classname('autocomplete');

type PreemieAutocompleteProps<T extends BaseAutocompleteItem> = {
    items: T[];
    value: T['value'];

    onChange?: (value: T['value']) => void;
    InputProps?: Omit<PreemieInputProps, 'readonly' | 'value'>;
};

export const PreemieAutocomplete = <T extends BaseAutocompleteItem>({
    items,
    value,

    onChange,
    InputProps = {},
}: PreemieAutocompleteProps<T>) => {
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleClickInput = (event: React.MouseEvent<HTMLIonInputElement>) => {
        handleOpenModal();

        if (InputProps.onClick) {
            InputProps.onClick(event);
        }
    };

    const handleChange = (value: T['value']) => {
        if (onChange) {
            onChange(value);
        }

        handleCloseModal();
    };

    return (
        <div className={cn()}>
            <PreemieInput {...InputProps} readonly value={value} onClick={handleClickInput} />

            <IonModal
                showBackdrop
                className={cn('modal')}
                isOpen={modalOpen}
                onDidDismiss={handleCloseModal}
            >
                <AutocompleteTypehead
                    items={items}
                    value={value}
                    onChange={handleChange}
                    onCancel={handleCloseModal}
                />
            </IonModal>
        </div>
    );
};
