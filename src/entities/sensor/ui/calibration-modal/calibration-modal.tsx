import React from 'react';
import { useSelector } from 'react-redux';
import { IonModal } from '@ionic/react';

import { classname } from '@shared/utils';
import { LogoAnimation } from '@ui/logo';
import { selectSensorCalibrationLoading } from '@entities/sensor/model';

import './calibration-modal.css';

const cn = classname('calibration-modal');

export const CalibrationModal: React.FunctionComponent = () => {
    const isCalibrationLoading = useSelector(selectSensorCalibrationLoading);

    const [open, setOpen] = React.useState(isCalibrationLoading);

    React.useEffect(() => {
        setOpen(isCalibrationLoading);
    }, [isCalibrationLoading]);

    return (
        <IonModal backdropDismiss={false} isOpen={open}>
            <div className={cn()}>
                <h1>Calibration in process...</h1>
                <p>
                    Please refrain from touching or interfering with the sensor during this brief
                    calibration process. Your cooperation ensures accurate measurements. This will
                    only take around 20 seconds.
                </p>

                <LogoAnimation />
            </div>
        </IonModal>
    );
};
