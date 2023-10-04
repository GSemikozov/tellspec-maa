import React from "react"
import { IonSegmentCustomEvent, SegmentChangeEventDetail } from "@ionic/core";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

import './tab-switch.css'

export type TabSwitchValue = 'info' | 'results';

export type TabSwitchAction = {
    value: TabSwitchValue;
    onChange: (value) => void
}

export const TabSwitch: React.FC<TabSwitchAction> = (props) => {
const {value, onChange} = props

const handleChange = (e: IonSegmentCustomEvent<SegmentChangeEventDetail>) => {
    onChange(e.target.value)
}


return (
    <IonSegment value={value} onIonChange={handleChange}>
        <IonSegmentButton value='info'>
            <IonLabel>Report Info</IonLabel>
        </IonSegmentButton>

        <IonSegmentButton value='results'>
            <IonLabel>Test results</IonLabel>
        </IonSegmentButton>
    </IonSegment>
);
}