import React, { useEffect } from 'react';
import { IonButton, IonModal } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { selectReportByMilkId } from '@entities/reports';
import { TestResults } from '@widgets/test-results';

import { TabSwitchValue } from '../tab-switch/tab-switch';
import { TabSwitch } from '../tab-switch';
import { ReportInfo } from '../report-info';

import { ReportNonAnalysed } from '../report-nonanalysed';
import { selectMilkByIds } from '@entities/milk/model/milk.selectors';
import { fetchMilksByIds } from '@entities/milk';
import { AppDispatch } from '@app/store';

import './reports-modal.css';

type ReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    milkID: string;
};

const cn = classname('report-modal');

const ModalContent = React.memo(({ milkID }: any) => {
    const [tabSwitch, setTabSwitch] = React.useState<TabSwitchValue>('info');

    const report = useSelector(state => selectReportByMilkId(state, milkID));
    const milkInfo = useSelector(state => selectMilkByIds(state, milkID));
    const handleTabChange = (value: TabSwitchValue) => {
        setTabSwitch(value);
    };

    console.log('report from ModalContent', report);

    return (
        <>
            <TabSwitch onChange={handleTabChange} value={tabSwitch} />

            <div className={cn('content')}>
                {tabSwitch === 'info' && <ReportInfo milkInfo={milkInfo} />}
                {tabSwitch === 'results' &&
                    (report && Object.keys(report).length === 0 ? (
                        <TestResults reportMilk={report} />
                    ) : (
                        <ReportNonAnalysed />
                    ))}
            </div>
        </>
    );
});

export const ReportModal: React.FC<ReportModalProps> = props => {
    const { isOpen, onClose, milkID } = props;

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        console.log('ReportModal goona dispatch', ReportModal);
        if (milkID.length > 0) {
            dispatch(fetchMilksByIds([milkID]));
        }
    }, [milkID]);

    return (
        <IonModal className={cn()} isOpen={isOpen} onIonModalDidDismiss={onClose}>
            <span className={cn('header')}>
                <IonButton className={cn('close-button')} onClick={onClose}>
                    Close
                </IonButton>
            </span>

            <ModalContent milkID={milkID} />
        </IonModal>
    );
};
