import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonCheckbox, IonCol, IonRow, IonText } from '@ionic/react';

import { DateRange } from '@ui/date-range';
import { fetchReport, selectReportsByDate } from '@entities/reports';

import ReportsIcon from '../../../assets/images/view-reports-selected.png';

import { ReportTable } from './report-table';
import { ActionsPanel } from './actions-panel';

import type { AppDispatch } from '@app';

import './reports-widget.css';

export const ReportsWidget: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [from, setFrom] = React.useState<string>('');
    const [to, setTo] = React.useState<string>('');
    const [selectAll, setSelectAll] = React.useState<boolean>(false);

    const data = useSelector(selectReportsByDate(from, to));

    React.useEffect(() => {
        dispatch(
            fetchReport({
                last_modified_gte: from,
                last_modified_lte: to,
            }),
        );
    }, [from, to]);

    const handleDateRangeChange = (name: string, value: string) => {
        if (name === 'from') {
            setFrom(value);
        } else {
            setTo(value);
        }
    };

    return (
        <>
            <IonRow className='ion-align-items-center'>
                <IonCol>
                    <div className='reports-header'>
                        <h2>
                            <IonText>
                                <img src={ReportsIcon} />
                                View Reports
                            </IonText>
                        </h2>
                    </div>
                    <IonCheckbox value={selectAll} onIonChange={() => setSelectAll(!selectAll)}>
                        Select All
                    </IonCheckbox>
                </IonCol>

                <IonCol>
                    <DateRange from={from} to={to} onChange={handleDateRangeChange} />
                </IonCol>
            </IonRow>

            <IonRow>
                <ReportTable data={data} />
            </IonRow>

            <ActionsPanel />
        </>
    );
};
