import React, { useEffect } from 'react';
import { IonButton, IonModal } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { donorsAsyncActions, donorsSelectors } from '@entities/donors';
import { userSelectors } from '@entities/user';
import { selectReportByMilkId } from '@entities/reports';
import { fetchGroup, selectGroupFreezers } from '@entities/groups';
import { fetchMilksByIds, selectMilkById } from '@entities/milk';
import { TestResults } from '@widgets/test-results';

import { TabSwitchValue } from '../tab-switch/tab-switch';
import { TabSwitch } from '../tab-switch';
import { ReportInfo } from '../report-info';
import { ReportNonAnalysed } from '../report-nonanalysed';

import type { AppDispatch } from '@app/store';

import './reports-modal.css';

const cn = classname('report-modal');

type ReportModalProps = {
    isOpen: boolean;
    milkID: string;
    onClose: () => void;
};

const ModalContent = React.memo(({ milkID, onClose }: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const [tabSwitch, setTabSwitch] = React.useState<TabSwitchValue>('info');

    const user = useSelector(userSelectors.getUser);
    const report = useSelector(state => selectReportByMilkId(state, milkID));
    const milk = useSelector(state => selectMilkById(state, milkID));
    const donorsList = useSelector(donorsSelectors.getAllDonors);
    const freezersList = useSelector(selectGroupFreezers);

    const sensitiveData = milk?.sensitive_data || {};
    const donor = donorsList.find(donor => donor.uuid === sensitiveData.sourceId);
    const freezer = freezersList.find(
        freezer => freezer.freezer_id === sensitiveData.storageFreezer,
    );

    useEffect(() => {
        const fetchDonorsRequest = {
            completeData: true,
            showArchived: false,
        };

        const fetchGroupRequest = {
            preemie_group_id: user.metadata.group_id,
            show_archived: false,
        };

        dispatch(fetchGroup(fetchGroupRequest));
        dispatch(donorsAsyncActions.fetchDonors(fetchDonorsRequest));
    }, []);

    const handleTabChange = (value: TabSwitchValue) => {
        setTabSwitch(value);
    };

    return (
        <>
            <TabSwitch onChange={handleTabChange} value={tabSwitch} />

            <div className={cn('content')}>
                {tabSwitch === 'info' ? (
                    <ReportInfo milk={milk} donor={donor} freezer={freezer} />
                ) : null}

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
