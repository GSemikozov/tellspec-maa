import React from 'react';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';

import type { IonSegmentCustomEvent, SegmentChangeEventDetail } from '@ionic/core';

export type FilterValue = 'analysed' | 'unanalysed' | 'all';

export type StatusFilter = {
    value: FilterValue;
    onChange: (value) => void;
};

export const StatusFilter: React.FC<StatusFilter> = props => {
    const { value, onChange } = props;

    const handleChange = (e: IonSegmentCustomEvent<SegmentChangeEventDetail>) => {
        onChange(e.target.value);
    };

    return (
        <IonSegment value={value} onIonChange={handleChange}>
            <IonSegmentButton value='analysed'>
                <IonLabel>Analysed</IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value='unanalysed'>
                <IonLabel>Unanalysed</IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value='all'>
                <IonLabel>All</IonLabel>
            </IonSegmentButton>
        </IonSegment>
    );
};
