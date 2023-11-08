import React from 'react';
import { useDispatch } from 'react-redux';

import { useCalibrateSensor, useSaveCalibrationSensor } from '@entities/sensor/hooks';
import { sensorActions } from '@entities/sensor/model';
import { NativeStorageKeys, nativeStore } from '@api/native';

import { CalibrationModal } from './calibration-modal';
import { SensorAnalyseInstructionsModal } from './sensor-analyse-instructions-modal';

import type { AppDispatch } from '@app';

export const PostCalibrationModalManager: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [calibrationModalOpen, setCalibrationModalOpen] = React.useState(false);

    const handleCloseCalibrationModal = () => setCalibrationModalOpen(false);

    const [sensorAnalyseInstructionsModalOpen, setSensorAnalyseInstructionsModalOpen] =
        React.useState(false);

    const handleCloseSensorAnalyseInstructionsModalOpen = () =>
        setSensorAnalyseInstructionsModalOpen(false);

    const [calibrateSensor, { loading: calibrateSensorLoading, hasError: hasCalibrationError }] =
        useCalibrateSensor({
            onError: async () => {
                handleCloseCalibrationModal();
            },
        });

    const [saveActiveCalibration, { loading: saveActiveCalibrationLoading }] =
        useSaveCalibrationSensor({
            onComplete: async () => {
                dispatch(sensorActions.acceptSensorCalibration());

                handleCloseCalibrationModal();

                const isPreventInstructions =
                    (await nativeStore.get(
                        NativeStorageKeys.PREVENT_SENSOR_ANALYSE_INSTRUCTIONS_MODAL,
                    )) ?? {};

                if (!isPreventInstructions.value) {
                    setSensorAnalyseInstructionsModalOpen(true);
                }
            },
        });

    const handleSubmitSensorAnalyseInstructionsModal = React.useCallback(
        (isPreventInstructions: boolean) => {
            nativeStore.set(NativeStorageKeys.PREVENT_SENSOR_ANALYSE_INSTRUCTIONS_MODAL, {
                value: isPreventInstructions,
                timestamps: +new Date(),
            });

            handleCloseSensorAnalyseInstructionsModalOpen();
        },
        [],
    );

    React.useEffect(() => {
        if (hasCalibrationError) {
            handleCloseCalibrationModal();
            return;
        }

        if (calibrateSensorLoading) {
            setCalibrationModalOpen(calibrateSensorLoading);
        }
    }, [calibrateSensorLoading, hasCalibrationError]);

    return (
        <>
            <CalibrationModal
                open={calibrationModalOpen}
                onClose={handleCloseCalibrationModal}
                calibrateSensorLoading={calibrateSensorLoading}
                saveActiveCalibrationLoading={saveActiveCalibrationLoading}
                onCalibrateSensor={calibrateSensor}
                onSaveCalibrationSensor={saveActiveCalibration}
            />

            <SensorAnalyseInstructionsModal
                open={sensorAnalyseInstructionsModalOpen}
                onClose={handleCloseSensorAnalyseInstructionsModalOpen}
                onSubmit={handleSubmitSensorAnalyseInstructionsModal}
            />
        </>
    );
};
