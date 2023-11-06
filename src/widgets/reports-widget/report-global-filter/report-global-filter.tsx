import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonLabel, IonRow, IonSearchbar, IonSegment, IonSegmentButton } from '@ionic/react';

import { Keyboard } from '@capacitor/keyboard';
import { closeCircleOutline } from 'ionicons/icons';

import { classname } from '@shared/utils';
// import { PreemieInput } from '@ui';
import { DateRange } from '@ui/date-range';
import { fetchReport, reportsActions, selectReportFilters } from '@entities/reports';

import { updateURL } from './report-global-filter.utils';

import type { AppDispatch } from '@app';

import './report-global-filter.css';

const cn = classname('report-global-filter');

export const ReportGlobalFilter: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { from, to, name, status } = useSelector(selectReportFilters);

    const handleNameChange = e => {
        dispatch(reportsActions.setReportsFilterByName(e.target.value));
        updateURL({ name: e.target.value });
        if (e.key === 'Enter') {
            Keyboard.hide();
        }
    };

    const handleClear = () => {
        dispatch(reportsActions.setReportsFilterByName(''));
        updateURL({ name: '' });
    };

    const handleStatusChange = e => {
        dispatch(reportsActions.setReportsFilterByStatus(e.target.value));
        updateURL({ status: e.target.value });
    };

    const handleDateChange = value => {
        dispatch(reportsActions.setReportsFilterByDate(value));
        dispatch(fetchReport());
        updateURL({ from: value.from, to: value.to });
    };

    return (
        <div className={cn()}>
            <div className={cn('first-row')}>
                <IonSearchbar
                    className={cn('name')}
                    placeholder='Search for ID'
                    class='preemieCustom'
                    value={name}  
                    clearIcon={closeCircleOutline}
                    onIonClear={handleClear}
                    showClearButton='always'
                    onKeyUp={handleNameChange}
                />

                <div className={cn('calendar')}>
                    <h5>Search for analysis dates:</h5>
                    <DateRange defaultFrom={from} defaultTo={to} onChange={handleDateChange} />
                </div>
            </div>

            <IonRow className={cn('second-row')}>
                <IonSegment value={status} onIonChange={handleStatusChange}>
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
            </IonRow>
        </div>
    );
};
