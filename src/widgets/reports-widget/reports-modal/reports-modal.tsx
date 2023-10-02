import React from 'react';
import { IonButton, IonModal } from '@ionic/react';
import { useSelector } from 'react-redux';

import { TestResults } from '@widgets/test-results';
import { classname } from '@shared/utils';
import { selectReportByMilkId } from '@entities/reports';

import './reports-modal.css';

type ReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    milkID: string;
};

const cn = classname('report-modal');

export const ReportModal: React.FC<ReportModalProps> = props => {
    const { milkID, isOpen, onClose } = props;

    const report = useSelector(state => selectReportByMilkId(state, milkID));
    const selectedMilkReportHasData = !!report?.data?.analyseData;

    if (!selectedMilkReportHasData) {
        return null;
    }

    return (
        <IonModal className={cn()} isOpen={isOpen} onIonModalDidDismiss={onClose}>
            <TestResults reportMilk={report} />
            <IonButton className={cn('close-button')} onClick={onClose}>
                Close
            </IonButton>
        </IonModal>
    );
};
