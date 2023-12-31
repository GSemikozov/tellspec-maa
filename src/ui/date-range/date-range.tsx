import React, { useState } from 'react';
import { format } from 'date-fns';
import { createPortal } from 'react-dom';
import { IonBackdrop, IonButton, IonCol, IonDatetime, IonLabel, IonRow } from '@ionic/react';

import { setStartDay, setEndDay, formatDateWithoutTime } from '@ui/date-range/date-range.utils';
import { classname } from '@shared/utils';

import type { DatetimeChangeEventDetail } from '@ionic/react';

import './date-range.css';
import { PreemieButton } from '@ui/button';

const cn = classname('date-range');

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
            setFrom(setStartDay(date));
            setTo(date.getTime() > dateTo.getTime() ? setEndDay(date) : to);
        } else {
            setTo(setEndDay(date));
        }
    };

    const handleSubmit = () => {
        setIsOpened(false);
        onChange({
            from: from !== '' ? from : undefined,
            to: to !== '' ? to : undefined,
        });
    };

    const handleCancel = () => {
        setIsOpened(false);
    };

    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const buttonLabel =
        from && to
            ? `${formatDateWithoutTime(dateFrom)} - ${formatDateWithoutTime(dateTo)}`
            : 'Select dates';

    const today = format(new Date(), 'yyyy-MM-dd');

    return (
        <div className={cn()}>
            <PreemieButton
                fill='outline'
                className={cn('button')}
                onClick={handlePopoverToggle}
                disabled={disabled}
            >
                {buttonLabel}
            </PreemieButton>

            {isOpened
                ? createPortal(
                      <div className={cn('modal')}>
                          <IonBackdrop tappable onIonBackdropTap={handlePopoverToggle} />

                          <div className={cn('popover')}>
                              <IonRow style={{ flexWrap: 'nowrap' }}>
                                  <IonCol>
                                      <IonLabel color='primary'>
                                          <h2>Filter reports from:</h2>
                                      </IonLabel>
                                      <IonDatetime
                                          name='from'
                                          max={today}
                                          presentation='date'
                                          onIonChange={handleDateChange}
                                          value={from}
                                      />
                                  </IonCol>

                                  <IonCol>
                                      <IonLabel color='primary'>
                                          <h2>Filter reports to:</h2>
                                      </IonLabel>
                                      <IonDatetime
                                          name='to'
                                          min={from}
                                          max={today}
                                          presentation='date'
                                          onIonChange={handleDateChange}
                                          value={to}
                                      />
                                  </IonCol>
                              </IonRow>

                              <IonRow className='ion-justify-content-end'>
                                  <IonButton onClick={handleSubmit}>OK</IonButton>
                                  <IonButton fill='outline' onClick={handleCancel}>
                                      Cancel
                                  </IonButton>
                              </IonRow>
                          </div>
                      </div>,
                      document.body,
                  )
                : null}
        </div>
    );
};
