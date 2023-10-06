import React from 'react';
import { IonButton, IonModal } from '@ionic/react';
import { useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { selectReportByMilkId } from '@entities/reports';
import { TestResults } from '@widgets/test-results';

import { TabSwitchValue } from '../tab-switch/tab-switch';
import { TabSwitch } from '../tab-switch';
import { ReportInfo } from '../report-info';

import './reports-modal.css';
import { ReportNonAnalysed } from '../report-nonanalysed';
import { selectMilkById, selectMilkByIds } from '@entities/milk/model/milk.selectors';

type ReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    milkID: string;
};

const cn = classname('report-modal');

const ModalContent = React.memo(({ milkID }: any) => {
    const [tabSwitch, setTabSwitch] = React.useState<TabSwitchValue>('info');

    const report = useSelector(state => selectReportByMilkId(state, milkID));
    const milkInfo = useSelector(state => selectMilkById(state, milkID));
    const handleTabChange = (value: TabSwitchValue) => {
        setTabSwitch(value);
    };

    return (
        <>
            <TabSwitch onChange={handleTabChange} value={tabSwitch} />

            <div className={cn('content')}>
                {tabSwitch === 'info' && <ReportInfo milkInfo={milkInfo} />}
                {tabSwitch === 'results' && <TestResults reportMilk={report} />}
            </div>
        </>
    );
});
const ModalContentUnanalysed = milkID => {
    const [tabSwitch, setTabSwitch] = React.useState<TabSwitchValue>('info');
    const milkInfo = useSelector(state => selectMilkById(state, milkID));
    const handleTabChange = (value: TabSwitchValue) => {
        setTabSwitch(value);
    };

    return (
        <>
            <TabSwitch onChange={handleTabChange} value={tabSwitch} />
            <div className={cn('content')}>
                {tabSwitch === 'info' && <ReportInfo milkInfo={milkInfo} />}
                {tabSwitch === 'results' && <ReportNonAnalysed />}
            </div>
        </>
    );
};

export const ReportModal: React.FC<ReportModalProps> = props => {
    const { isOpen, onClose, milkID } = props;

    const report = useSelector(state => selectReportByMilkId(state, milkID));
    const selectedMilkReportHasData = !!report?.data?.analyseData;

    return (
        <IonModal className={cn()} isOpen={isOpen} onIonModalDidDismiss={onClose}>
            <span className={cn('header')}>
                <IonButton className={cn('close-button')} onClick={onClose}>
                    Close
                </IonButton>
            </span>
            {selectedMilkReportHasData ? (
                <ModalContent milkID={milkID} />
            ) : (
                <ModalContentUnanalysed milkID={milkID} />
            )}
        </IonModal>
    );
};
