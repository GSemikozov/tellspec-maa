import React from 'react';
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonSearchbar,
    IonToolbar,
    IonFooter,
    IonRadio,
    IonRadioGroup,
} from '@ionic/react';

import { classname } from '@shared/utils';

import { BaseAutocompleteItem } from './types';

import type {
    IonSearchbarCustomEvent,
    SearchbarInputEventDetail,
    IonRadioGroupCustomEvent,
    RadioGroupChangeEventDetail,
} from '@ionic/core';

import './autocomplete-typehead.css';
import { PreemieButton } from '@ui/button';

const cn = classname('autocomplete-typehead');

export type AutocompleteTypeaheadProps<T extends BaseAutocompleteItem> = {
    items: T[];
    value: T['value'];

    onChange: (item: T['value']) => void;
    onCancel: () => void;
};

export const AutocompleteTypehead = <T extends BaseAutocompleteItem>({
    items,
    value,

    onChange,
    onCancel,
}: AutocompleteTypeaheadProps<T>) => {
    const [filteredItems, setFilteredItems] = React.useState<T[]>(() => {
        const chosenItemIdx = items.findIndex(item => item.value === value);

        if (chosenItemIdx === -1) {
            return items;
        }

        return [
            items[chosenItemIdx],
            ...items.slice(0, chosenItemIdx),
            ...items.slice(chosenItemIdx + 1),
        ];
    });

    const [chosenItem, setChosenItem] = React.useState<T['value']>(() => value);

    const handleChange = (event: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail>) => {
        setChosenItem(event.detail.value);
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleConfirm = () => {
        onChange(chosenItem);
    };

    const filterList = (searchQuery: string) => {
        if (searchQuery === '') {
            setFilteredItems([...items]);

            return;
        }

        const normalizedQuery = searchQuery.toLowerCase();
        const filteredItems = items.filter(item =>
            item.title.toLowerCase().includes(normalizedQuery),
        );

        setFilteredItems(filteredItems);
    };

    const handleChangeSearchbar = (event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) => {
        filterList(event.target.value ?? '');
    };

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonSearchbar className={cn('searchbar')} onIonInput={handleChangeSearchbar} />
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonList inset>
                    <IonRadioGroup value={chosenItem} onIonChange={handleChange}>
                        {filteredItems.map(item => (
                            <IonItem lines='none' key={item.value} className={'list-item'}>
                                <IonRadio
                                    justify='start'
                                    labelPlacement='end'
                                    value={item.value}
                                    className={cn('list-item')}
                                >
                                    {item.title}
                                </IonRadio>
                            </IonItem>
                        ))}
                    </IonRadioGroup>
                </IonList>
            </IonContent>

            <IonFooter className={cn('footer')}>
                <IonToolbar>
                    <IonButtons slot='end'>
                        <PreemieButton onClick={handleCancel}>Cancel</PreemieButton>
                        <PreemieButton onClick={handleConfirm}>Done</PreemieButton>
                    </IonButtons>
                </IonToolbar>
            </IonFooter>
        </>
    );
};
