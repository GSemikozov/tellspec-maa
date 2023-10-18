import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LogoAnimation } from '@ui/logo/animated-logo';
import { ReportsIcon } from '@ui/icons';
import { PageArea } from '@shared/ui';
import { classname } from '@shared/utils';
import { fetchReport, selectIsReportLoading, selectReportsByDate } from '@entities/reports';

import { ReportModal } from './reports-modal';
import { ReportTable } from './report-table';
import { ActionsPanel } from './actions-panel';
import { ReportGlobalFilter } from './report-global-filter';

import type { AppDispatch } from '@app';

import './reports-widget.css';

const cn = classname('reports-widget');

export const ReportsWidget: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [selectedMilkID, setSelectedMilkID] = React.useState<string | null>();
    const [isReportModalOpened, setIsReportModalOpened] = React.useState(false);
    const [reportsSelection, setReportsSelection] = React.useState({});

    const reportsLoading = useSelector(selectIsReportLoading);
    const reports = useSelector(selectReportsByDate);

    useEffect(() => {
        dispatch(fetchReport());
    }, []);

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
                className={cn('page-area-header')}
                title='Milk Reports'
                icon={<ReportsIcon />}
                actions={reportsLoading ? null : <ReportGlobalFilter />}
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
