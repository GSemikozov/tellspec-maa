import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { IonBackdrop, IonButton, IonDatetime, IonRow } from '@ionic/react';

import { formatUTCDate, setEndDay, setStartDay } from '@ui/date-range/utils';
import { classname } from '@shared/utils';

import type { DatetimeChangeEventDetail } from '@ionic/react';

import './date-range.css';

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
        onChange({
            from: defaultFrom,
            to: defaultTo,
        });
    };

    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const buttonLabel =
        from && to ? `${formatUTCDate(dateFrom)} - ${formatUTCDate(dateTo)}` : 'Select dates';

    // TODO: implement this kind of validation
    // const isFromEnabled = (dateString: string) => {
    //     const date = new Date(dateString);
    //     const utcFrom = date.getUTCDate();
    //     const utcTo = dateTo.getUTCDate();
    //     return utcFrom < utcTo;
    // };

    const today = new Date().toISOString().slice(0, 10);

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
                              <IonRow style={{ flexWrap: 'nowrap' }}>
                                  <IonDatetime
                                      name='from'
                                      max={today}
                                      presentation='date'
                                      onIonChange={handleDateChange}
                                      value={from}
                                      //   isDateEnabled={isFromEnabled}
                                  />

                                  <IonDatetime
                                      name='to'
                                      max={today}
                                      presentation='date'
                                      onIonChange={handleDateChange}
                                      value={to}
                                  />
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
