import React from 'react';
import { IonButton, IonModal } from '@ionic/react';
import { useSelector } from 'react-redux';
import { TabSwitch } from '../tab-switch';


import { classname } from '@shared/utils';
import { selectReportByMilkId } from '@entities/reports';

import './reports-modal.css';
import { TabSwitchValue } from '../tab-switch/tab-switch';

import { TestResults } from '@widgets/test-results';
import { ReportInfo } from '../report-info';

type ReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    milkID: string;
};

const cn = classname('report-modal');

export const ReportModal: React.FC<ReportModalProps> = props => {
    const { isOpen, onClose, milkID } = props;
    const [tabSwitch, setTabSwitch] = React.useState<TabSwitchValue>('info');

    const report = useSelector(state => selectReportByMilkId(state, milkID));
    const selectedMilkReportHasData = !!report?.data?.analyseData;

    if (!selectedMilkReportHasData) {
        return null;
    }

    const handleTabChange = (value: TabSwitchValue) => {
        setTabSwitch(value);
    };

    return (
        <IonModal className={cn()} isOpen={isOpen} onIonModalDidDismiss={onClose}>
            <div className={cn('header')}>
                <TabSwitch onChange={handleTabChange} value={tabSwitch} />
            <IonButton className={cn('close-button')} onClick={onClose}>
                Close
            </IonButton>
            </div>
            {selectedMilkReportHasData && (
                <div className={cn('content')}>
                    {tabSwitch === 'info' && <ReportInfo />}
                    {tabSwitch === 'results' && <TestResults reportMilk={report} />}
                </div>
            )}
        </IonModal>
    );
};
