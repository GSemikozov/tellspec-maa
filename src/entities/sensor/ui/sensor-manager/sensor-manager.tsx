import React from 'react';
import { IonButton, IonText } from '@ionic/react';
import { useSelector } from 'react-redux';
import { SensorEvent } from 'tellspec-sensor-sdk/src';

import { classname } from '@shared/utils';
import {
    selectSensorCalibrationDisconnected,
    selectSensorCalibrationLoading,
    selectSensorCalibrationRequired,
    selectSensorDevice,
    useCalibrateSensor,
    useRemoveSensor,
} from '@entities/sensor';
import {
    SensorConnectionProcessStatus,
    useSensorConnectionProcess,
} from '@widgets/sensor-connection-process';
import { tellspecAddListener } from '@api/native';

import { SensorManagerInstructions } from './sensor-manager-instructions';
import { SensorManagerInteractiveImage } from './sensor-manager-interactive-image';

import './sensor-manager.css';

import type { PluginListenerHandle } from '@capacitor/core';

const cn = classname('sensor-manager');

export const SensorManager: React.FunctionComponent = () => {
    const {
        status: sensorConnectionProcessStatus,
        onStartDiscovery,
        onResetStatus,
    } = useSensorConnectionProcess();

    const [calibrateSensor] = useCalibrateSensor();
    const [removeSensor] = useRemoveSensor({
        onComplete: () => {
            onResetStatus();
        },
    });

    const [scannerStatusListener, setScannerStatusListener] =
        React.useState<PluginListenerHandle | null>(null);

    const currentDevice = useSelector(selectSensorDevice);

    const calibrationDisconnected = useSelector(selectSensorCalibrationDisconnected);
    const calibrationRequired = useSelector(selectSensorCalibrationRequired);
    const calibrationLoading = useSelector(selectSensorCalibrationLoading);

    const getInstructions = React.useCallback(() => {
        if (calibrationDisconnected) {
            const discovering = [
                SensorConnectionProcessStatus.CHECKING_BLE,
                SensorConnectionProcessStatus.DISCOVERING,
                SensorConnectionProcessStatus.CHOOSE_DISCOVERED_DEVICE,
                SensorConnectionProcessStatus.PAIRING_DISCOVERED_DEVICE,
            ].includes(sensorConnectionProcessStatus);

            const handleClickStartDiscovery = () => {
                onStartDiscovery({ enableBleCheck: true });
            };

            return {
                title: 'Connect a Preemie sensor',
                content: (
                    <>
                        <p>
                            If this is the first time you are using the Preemie Sensor, please click
                            to see videos that explains how to run analyses and how to clean the couvette.
                        </p>

                        <div className={cn('actions')}>
                            <IonButton disabled={discovering} onClick={handleClickStartDiscovery}>
                                Select Sensor
                            </IonButton>
                           
                            <div className={cn('actions-buttons')}>
                            <h2>
                                <IonText>Videos</IonText>
                            </h2>
                                <IonButton>Analyses</IonButton>
                                <IonButton>Cleaning </IonButton>
                            </div>
                        </div>
                    </>
                ),
            };
        }

        if (calibrationRequired && currentDevice) {
            return {
                title: 'Calibration required',
                content: (
                    <>
                        <div className={cn('actions')}>
                            <IonButton onClick={calibrateSensor}>Start Calibration</IonButton>

                            <IonButton onClick={() => removeSensor(currentDevice.uuid)}>
                                Unpair Sensor
                            </IonButton>
                        </div>
                    </>
                ),
            };
        }

        if (calibrationLoading) {
            return {
                title: 'Calibration in Progress',
                content: (
                    <>
                        <p>
                            Please refrain from touching or interfering with the sensor during this
                            brief calibration process. Your cooperation ensures accurate
                            measurements. This will only take around 90 seconds.
                        </p>
                    </>
                ),
            };
        }

        return null;
    }, [
        currentDevice,
        calibrateSensor,
        removeSensor,
        sensorConnectionProcessStatus,
        calibrationDisconnected,
        calibrationRequired,
        calibrationLoading,
        onStartDiscovery,
        onResetStatus,
    ]);

    React.useEffect(() => {
        if (scannerStatusListener === null) {
            setScannerStatusListener(
                tellspecAddListener(SensorEvent.SCANNER_STATUS, (data: any) => {
                    // const status = data.state;

                    // switch (status) {
                    //     case 'off':
                    //         dispatch(removeDevice());
                    //         onResetStatus();
                    //         break;
                    // }

                    console.log('[scanner status listener]', JSON.stringify(data));
                }),
            );
        }

        return () => {
            if (scannerStatusListener) {
                scannerStatusListener.remove();
            }
        };
    }, []);

    const instructions = getInstructions();

    return (
        <div className={cn()}>
            {instructions ? (
                <SensorManagerInstructions
                    highlight={calibrationLoading}
                    title={instructions.title}
                    className={cn('instructions')}
                >
                    {instructions.content}
                </SensorManagerInstructions>
            ) : null}

            <SensorManagerInteractiveImage />
        </div>
    );
};
