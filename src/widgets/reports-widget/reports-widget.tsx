import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LogoAnimation } from '@ui/logo/animated-logo';
import { DateRange, setEndDay, setStartDay } from '@ui/date-range';
import { ReportsIcon } from '@ui/icons';
import { PageArea } from '@shared/ui';
import { classname } from '@shared/utils';
import { fetchReport, selectIsReportLoading, selectReportsByDate } from '@entities/reports';

import { ReportTable } from './report-table';
import { ActionsPanel } from './actions-panel';

import type { AppDispatch } from '@app';

// import { ReportsIcon } from '@ui/icons';
import './reports-widget.css';
// import { IonCheckbox } from '@ionic/react';

const cn = classname('reports-widget');

export const ReportsWidget: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const date = new Date();
    const fromDefaultDate = setStartDay(date);
    const toDefaultDate = setEndDay(date);

    const [from, setFrom] = React.useState<string>(fromDefaultDate);
    const [to, setTo] = React.useState<string>(toDefaultDate);

    const reportsLoading = useSelector(selectIsReportLoading);
    const reports = useSelector(state => selectReportsByDate(state, from, to));

    useEffect(() => {
        dispatch(
            fetchReport({
                last_modified_gte: undefined,
                last_modified_lte: undefined,
            }),
        );
    }, []);

    const handleDateRangeChange = range => {
        setFrom(range.from);
        setTo(range.to);
        dispatch(
            fetchReport({
                last_modified_gte: range.from,
                last_modified_lte: range.to,
            }),
        );
    };

    const renderMain = React.useMemo(() => {
        if (reportsLoading) {
            return (
                <div className={cn('placeholder')}>
                    <LogoAnimation />
                    Loading...
                </div>
            );
        }

        return <ReportTable reports={reports} />;
    }, [reportsLoading, reports]);

    return (
        <PageArea>
            <PageArea.Header
                title='Milk Analyses'
                icon={<ReportsIcon />}
                actions={
                    reportsLoading ? null : (
                        <DateRange
                            defaultFrom={from}
                            defaultTo={to}
                            onChange={handleDateRangeChange}
                        />
                    )
                }
                className={cn('header')}
            />

            <PageArea.Main className={cn('main')}>{renderMain}</PageArea.Main>

            <div className={cn('actions')}>{reportsLoading ? null : <ActionsPanel />}</div>
        </PageArea>
    );
};
