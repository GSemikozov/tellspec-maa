import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { IonBackdrop, IonButton, IonDatetime, IonRow } from '@ionic/react';
import { format } from 'date-fns';

import { classname } from '@shared/utils';

import { setDefaultTime } from './utils';

import type { DatetimeChangeEventDetail } from '@ionic/react';

import './date-range.css';

const cn = classname('date-range');

// type Name = 'from' | 'to';

type SubmitHandlerRange = {
    from?: string;
    to?: string;
};

type DataRangeProps = {
    onChange: (range: SubmitHandlerRange) => void;
    defaultFrom?: string;
    defaultTo?: string;
    disabled?: boolean;
};

export const DateRange: React.FunctionComponent<DataRangeProps> = props => {
    const { defaultFrom = '', defaultTo = '', onChange, disabled } = props;

    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [from, setFrom] = useState(defaultFrom);
    const [to, setTo] = useState(defaultTo);

    const handlePopoverToggle = () => {
        setIsOpened(isOpened => !isOpened);
    };

    const handleDateChange = (e: CustomEvent<DatetimeChangeEventDetail>) => {
        const { target, detail } = e;
        const { name } = target as HTMLIonDatetimeElement;
        const date = new Date(detail.value as string);

        if (name === 'from') {
            setFrom(setDefaultTime(date));
        } else {
            setTo(setDefaultTime(date));
        }
    };

    const handleSubmit = () => {
        setIsOpened(false);
        onChange({
            from: from !== '' ? from : undefined,
            to: to !== '' ? to : undefined,
        });
    };

    const buttonLabel =
        from && to
            ? `${format(new Date(from), 'MM/dd/yy')} - ${format(new Date(to), 'MM/dd/yy')}`
            : 'Select dates';

    return (
        <div className={cn()}>
            <IonButton
                fill='outline'
                className={cn('button')}
                onClick={handlePopoverToggle}
                disabled={disabled}
            >
                {buttonLabel}
            </IonButton>

            {isOpened
                ? createPortal(
                      <div className={cn('modal')}>
                          <IonBackdrop tappable onIonBackdropTap={handlePopoverToggle} />

                          <div className={cn('popover')}>
                              <IonRow>
                                  <IonDatetime
                                      name='from'
                                      presentation='date'
                                      onIonChange={handleDateChange}
                                      value={from}
                                  />

                                  <IonDatetime
                                      name='to'
                                      presentation='date'
                                      onIonChange={handleDateChange}
                                      value={to}
                                  />
                              </IonRow>

                              <IonRow className='ion-justify-content-end'>
                                  <IonButton onClick={handleSubmit}>OK</IonButton>
                              </IonRow>
                          </div>
                      </div>,
                      document.body,
                  )
                : null}
        </div>
    );
};
