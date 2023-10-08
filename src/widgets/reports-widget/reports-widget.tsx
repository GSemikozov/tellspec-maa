import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LogoAnimation } from '@ui/logo/animated-logo';
import { DateRange, setEndDay, setStartDay } from '@ui/date-range';
import { ReportsIcon } from '@ui/icons';
import { PageArea } from '@shared/ui';
import { classname } from '@shared/utils';
import { fetchReport, selectIsReportLoading, selectReportsByDate } from '@entities/reports';

import { ReportModal } from './reports-modal';
import { ReportTable } from './report-table';
import { ActionsPanel } from './actions-panel';

import type { AppDispatch } from '@app';

import './reports-widget.css';


const cn = classname('reports-widget');

export const ReportsWidget: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const date = new Date();
    const fromDefaultDate = setStartDay(date);
    const toDefaultDate = setEndDay(date);

    const [selectedMilkID, setSelectedMilkID] = React.useState<string | null>();
    const [isReportModalOpened, setIsReportModalOpened] = React.useState(false);
    const [reportsSelection, setReportsSelection] = React.useState({});

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

    console.log('reportsSelection', reportsSelection);

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

    const handleModalClose = () => {
        setIsReportModalOpened(false);
        setTimeout(setSelectedMilkID, 500, null);
    };

    const handleRowClick = (id: string) => {
        setSelectedMilkID(id);
        setIsReportModalOpened(true);
     

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

        return (
            <ReportTable
                reports={reports}
                onRowSelectionChange={setReportsSelection}
                onRowClick={handleRowClick}
            />
        );
    }, [reportsLoading, reports]);

    return (
        <PageArea>
            <PageArea.Header
                title='Milk Reports'
                icon={<ReportsIcon />}
                actions={
                    reportsLoading ? null : (
                        <div className={cn('calendar')}>
                            <h5>Search for analysis dates:</h5>
                            <DateRange
                                defaultFrom={from}
                                defaultTo={to}
                                onChange={handleDateRangeChange}
                            />
                        </div>
                    )
                }
                className={cn('header')}
            />

            <PageArea.Main className={cn('main')}>{renderMain}</PageArea.Main>

            <div className={cn('actions')}>
                {reportsLoading ? null : (
                    <ActionsPanel selectedIDS={Object.keys(reportsSelection)} />
                )}
            </div>

         
            {selectedMilkID && (
                <ReportModal
                milkID={selectedMilkID}
                isOpen={isReportModalOpened}
                onClose={handleModalClose}
                />
                )}
        </PageArea>
    );
};
