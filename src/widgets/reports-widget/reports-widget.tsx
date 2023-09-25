import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LogoAnimation } from '@ui/logo/animated-logo';
import { DateRange } from '@ui/date-range';
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

    const [from, setFrom] = React.useState<string>('');
    const [to, setTo] = React.useState<string>('');

    const reportsLoading = useSelector(selectIsReportLoading);
    const reports = useSelector(state => selectReportsByDate(state, from, to));

    React.useEffect(() => {
        dispatch(
            fetchReport({
                last_modified_gte: from !== '' ? from : undefined,
                last_modified_lte: to !== '' ? to : undefined,
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
                        <DateRange from={from} to={to} onChange={handleDateRangeChange} />
                    )
                }
                className={cn('header')}
            />

            <PageArea.Main className={cn('main')}>{renderMain}</PageArea.Main>

            <div className={cn('actions')}>{reportsLoading ? null : <ActionsPanel />}</div>
        </PageArea>
    );
};
