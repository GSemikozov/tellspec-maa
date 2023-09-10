import React, { useState } from "react";
import { createPortal } from "react-dom";
import { IonBackdrop, IonButton, IonDatetime } from "@ionic/react";

import type { DatetimeChangeEventDetail } from "@ionic/react";

import "./date-range.css";

type Name = 'from' | 'to';

interface DataRangeProps {
    onChange: (name: Name, value: string) => void;
    from?: string;
    to?: string;
}

export const DateRange: React.FC<DataRangeProps> = (props) => {
    const { from, to, onChange } = props;

    const [isOpened, setIsOpened] = useState<boolean>(false);

    const handlePopoverToggle = () => {
        setIsOpened((isOpened) => !isOpened);
    }

    const handleDateChange = (e: CustomEvent<DatetimeChangeEventDetail>) => {
        const { target, detail } = e;
        const { name } = target as HTMLIonDatetimeElement;
        onChange(name as Name, detail.value as string);
    }

    return (
        <div className="dateRange">
            <IonButton onClick={handlePopoverToggle}>
                { from && to ? `${from} - ${to}` : 'Select dates' }
            </IonButton>

            {
                isOpened ? createPortal((
                    <div className="dateRange">
                        <IonBackdrop
                            tappable
                            onIonBackdropTap={handlePopoverToggle}
                        />

                        <div className="dateRange__popover">
                            <IonDatetime
                                name="from"
                                presentation="date"
                                onIonChange={handleDateChange}
                                value={from as string}
                            />
                            <IonDatetime
                                name="to"
                                presentation="date"
                                onIonChange={handleDateChange}
                                value={to as string}
                            />
                        </div>
                    </div>
                ), document.body) : null
            }
        </div>
    )
}