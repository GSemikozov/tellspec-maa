import React, { useEffect } from 'react';
import { IonButton, IonModal } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { selectReportByMilkId } from '@entities/reports';
import { TestResults } from '@widgets/test-results';
import { selectMilkByIds } from '@entities/milk/model/milk.selectors';
import { fetchMilksByIds } from '@entities/milk';
import { AppDispatch } from '@app/store';

import { TabSwitchValue } from '../tab-switch/tab-switch';
import { TabSwitch } from '../tab-switch';
import { ReportInfo } from '../report-info';
import { ReportNonAnalysed } from '../report-nonanalysed';

import './reports-modal.css';

const cn = classname('report-modal');

type ReportModalProps = {
    isOpen: boolean;
    milkID: string;
    onClose: () => void;
};

const ModalContent = React.memo(({ milkID, onClose }: any) => {
    const [tabSwitch, setTabSwitch] = React.useState<TabSwitchValue>('info');

    const report = useSelector(state => selectReportByMilkId(state, milkID));
    const milkInfo = useSelector(state => selectMilkByIds(state, milkID));

    const handleTabChange = (value: TabSwitchValue) => {
        setTabSwitch(value);
    };

    return (
        <>
            <TabSwitch onChange={handleTabChange} value={tabSwitch} />

            <div className={cn('content')}>
                {tabSwitch === 'info' ? <ReportInfo milkInfo={milkInfo} /> : null}

                {tabSwitch === 'results' ? (
                    report && report?.data?.analyseData ? (
                        <div className={cn('test-results')}>
                            <TestResults reportMilk={report} />
                        </div>
                    ) : (
                        <ReportNonAnalysed milkId={milkID} onModalClose={onClose} />
                    )
                ) : null}
            </div>
        </>
    );
});

export const ReportModal: React.FC<ReportModalProps> = props => {
    const { isOpen, onClose, milkID } = props;

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (milkID.length > 0) {
            dispatch(fetchMilksByIds(milkID));
        }
    }, []);

    return (
        <IonModal className={cn()} isOpen={isOpen} onIonModalDidDismiss={onClose}>
            <span className={cn('header')}>
                <IonButton className={cn('close-button')} onClick={onClose}>
                    Close
                </IonButton>
            </span>

            <ModalContent milkID={milkID} onClose={onClose} />
        </IonModal>
    );
};
