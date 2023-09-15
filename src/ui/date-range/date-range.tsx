import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { IonBackdrop, IonButton, IonDatetime } from '@ionic/react';
import { format } from 'date-fns';

import { setDefaultTime } from './utils';

import type { DatetimeChangeEventDetail } from '@ionic/react';

import './date-range.css';

type Name = 'from' | 'to';

interface DataRangeProps {
    onChange: (name: Name, value: string) => void;
    from?: string;
    to?: string;
}

export const DateRange: React.FC<DataRangeProps> = props => {
    const { from, to, onChange } = props;

    const [isOpened, setIsOpened] = useState<boolean>(false);

    const handlePopoverToggle = () => {
        setIsOpened(isOpened => !isOpened);
    };

    const handleDateChange = (e: CustomEvent<DatetimeChangeEventDetail>) => {
        const { target, detail } = e;
        const { name } = target as HTMLIonDatetimeElement;
        const date = new Date(detail.value as string);
        onChange(name as Name, setDefaultTime(date));
    };

    const buttonLabel =
        from && to
            ? `${format(new Date(from), 'MM/dd/yy')} - ${format(new Date(to), 'MM/dd/yy')}`
            : 'Select dates';

    return (
        <div className='dateRange'>
            <IonButton fill='outline' onClick={handlePopoverToggle}>
                {buttonLabel}
            </IonButton>

            {isOpened
                ? createPortal(
                      <div className='dateRange'>
                          <IonBackdrop tappable onIonBackdropTap={handlePopoverToggle} />

                          <div className='dateRange__popover'>
                              <IonDatetime
                                  name='from'
                                  presentation='date'
                                  onIonChange={handleDateChange}
                                  value={from as string}
                              />
                              <IonDatetime
                                  name='to'
                                  presentation='date'
                                  onIonChange={handleDateChange}
                                  value={to as string}
                              />
                          </div>
                      </div>,
                      document.body,
                  )
                : null}
        </div>
    );
};
