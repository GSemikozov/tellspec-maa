import React from 'react';
import { useSelector } from 'react-redux';

import { PreemieToast } from '@shared/ui';
import { classname } from '@shared/utils';
import { CalibrationStatus, selectSensorCalibrationStatus } from '@entities/sensor/model';

const cn = classname('sensor-manager-toast');

const OPENED_STATUSES: CalibrationStatus[] = [CalibrationStatus.ERROR];

const TOAST_DURATION = 3_000;

const TOAST_DATA_BY_STATUS = {
    [CalibrationStatus.ERROR]: {
        type: 'error',
        message: 'An error occurred during calibration',
    },
};

export const SensorManagerToast: React.FunctionComponent = () => {
    const calibrationStatus = useSelector(selectSensorCalibrationStatus);

    const { type, message } = TOAST_DATA_BY_STATUS[calibrationStatus] ?? {};

    const [toastOpen, setToastOpen] = React.useState(false);

    const handleCloseToast = () => setToastOpen(false);

    React.useEffect(() => {
        setToastOpen(Boolean(message) && OPENED_STATUSES.includes(calibrationStatus));
    }, [calibrationStatus, message]);

    return (
        <PreemieToast
            id='sensor-manager-toast'
            className={cn('')}
            type={type}
            isOpen={toastOpen}
            message={message}
            duration={TOAST_DURATION}
            onDidDismiss={handleCloseToast}
        />
    );
};
