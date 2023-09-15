import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonCheckbox, IonCol, IonRow, IonText } from '@ionic/react';

import { DateRange } from '@ui/date-range';

import { reportsAsyncActions, reportsSelectors } from '../../entities/reports';

import { ReportTable } from './report-table';
import { ActionsPanel } from './actions-panel';

import type { AppDispatch } from '@app';

// import ReportsIcon from '../../../assets/images/view-reports-selected.png';
import { ReportsIcon } from '@ui/icons';
import './reports-widget.css';
import { classname } from '@shared/utils';

const cn = classname('reports-page')

export const ReportsWidget: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [from, setFrom] = useState<string>();
    const [to, setTo] = useState<string>();
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const data = useSelector(reportsSelectors.selectReportsByDate(from, to));

    useEffect(() => {
        dispatch(
            reportsAsyncActions.fetchReport({
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
            <IonRow className={cn()}>
                <IonCol>
                    <div className={cn('header')}>
                        <div className={cn('header-title')}>
                            <div className={cn('header-icon')}>
                                <ReportsIcon size={32} color='currentColor' />
                            </div>

                            <div className={cn('header-title-text')}>View Reports</div>
                        </div>
                    </div>
                    <div className={cn('checkbox')}>
                        <IonCheckbox value={selectAll} onIonChange={() => setSelectAll(!selectAll)}>
                            Select All
                        </IonCheckbox>
                    </div>
                </IonCol>

                <IonCol>``
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
