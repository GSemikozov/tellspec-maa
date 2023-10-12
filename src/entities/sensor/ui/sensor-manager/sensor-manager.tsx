import React from 'react';
import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonItem,
    IonModal,
    IonTitle,
    useIonRouter,
} from '@ionic/react';
import { useSelector } from 'react-redux';
import { SensorEvent } from 'tellspec-sensor-sdk/src';

import { classname } from '@shared/utils';
import {
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

import { routesMapping } from '@app/routes';

import { SensorManagerInstructions } from './sensor-manager-instructions';
import { SensorManagerInteractiveImage } from './sensor-manager-interactive-image';

import './sensor-manager.css';

import type { PluginListenerHandle } from '@capacitor/core';
import { CalibrationModal } from './calibration-modal';

const cn = classname('sensor-manager');

export const SensorManager: React.FunctionComponent = () => {
    const router = useIonRouter();

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

    const [sensorInformationVideo, setSensorInformationVideo] = React.useState<string | null>(null);

    const [calibrationModalOpened, setCalibrationModalOpened] = React.useState<boolean | null>(
        null,
    );

    const currentDevice = useSelector(selectSensorDevice);

    const calibrationRequired = useSelector(selectSensorCalibrationRequired);
    const calibrationLoading = useSelector(selectSensorCalibrationLoading);

    const handleModalClose = () => {
        setCalibrationModalOpened(false);
    };
    const handleChooseSensorInformationVideo = (video: string) => () => {
        setSensorInformationVideo(video);
    };

    const handleResetSensorInformationVideo = () => {
        setSensorInformationVideo(null);
    };

    const handleCalibration = () => {
        setCalibrationModalOpened(true);
        <CalibrationModal isOpen={calibrationModalOpened} onClose={handleModalClose} />;
        router.push(routesMapping.sensorPage);
        calibrateSensor(currentDevice);
    };

    const getInstructions = React.useCallback(() => {
        if (!currentDevice) {
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
                title: '',
                content: (
                    <>
                        <div className={cn('actions')}>
                            <IonButton disabled={discovering} onClick={handleClickStartDiscovery}>
                                Select Preemie Sensor
                            </IonButton>
                        </div>
                    </>
                ),
            };
            
        }

        if (currentDevice && calibrationRequired) {
            return {
                title: 'Calibration required',
                content: (
                    <>
                        <div className={cn('actions')}>
                            <IonButton onClick={handleCalibration}>Start Calibration</IonButton>

                            <IonButton onClick={() => removeSensor(currentDevice.uuid)}>
                                Unpair Sensor
                            </IonButton>
                        </div>
                    </>
                ),
            };
        }

        // if (calibrationLoading) {
        //     return {
        //         title: 'Calibration in Progress',
        //         content: <></>,
        //     };
        // }

        return null;
    }, [
        currentDevice,
        calibrateSensor,
        removeSensor,
        sensorInformationVideo,
        sensorConnectionProcessStatus,
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

            <IonAccordionGroup className={cn('accordion-group')}>
                <IonAccordion value='first'>
                    <IonItem slot='header' color='none' className={cn('accordion-header')}>
                        <IonTitle className='ion-no-padding ion-no-margin  '>
                            Video tutorials
                        </IonTitle>
                    </IonItem>

                    <div className={cn('videos-container')} slot='content'>
                        <p>
                            Tap a button below for a video showing how to switch the Preemie Sensor
                            on and analyse a milk sample, and another showing how to clean the
                            cuvette which held the sample.
                        </p>
                        <div className={cn('actions-buttons')}>
                            <IonButton
                                className='ion-no-margin'
                                onClick={handleChooseSensorInformationVideo('analyses')}
                            >
                                Analysis
                            </IonButton>

                            <IonButton
                                className='ion-no-margin'
                                onClick={handleChooseSensorInformationVideo('cleaning')}
                            >
                                Cleaning
                            </IonButton>

                            <IonModal
                                isOpen={Boolean(sensorInformationVideo)}
                                className={cn('video-modal')}
                                onDidDismiss={handleResetSensorInformationVideo}
                            >
                                {sensorInformationVideo === 'analyses' ? (
                                    <div className={cn('video')}>
                                        <video autoPlay controls>
                                            <source
                                                type='video/mp4'
                                                src='./videos/preemie-sept-15.mp4'
                                            />
                                        </video>
                                    </div>
                                ) : null}

                                {sensorInformationVideo === 'cleaning' ? (
                                    <div className={cn('video')}>
                                        <video autoPlay controls>
                                            <source
                                                type='video/mp4'
                                                src='./videos/cleaning-video.mp4'
                                            />
                                        </video>
                                    </div>
                                ) : null}

                                <IonButton
                                    className={cn('close-button')}
                                    onClick={handleResetSensorInformationVideo}
                                >
                                    Close
                                </IonButton>
                            </IonModal>
                        </div>
                    </div>
                </IonAccordion>
            </IonAccordionGroup>

            <IonTitle className='ion-text-center ion-margin-top'>{currentDevice?.serial}</IonTitle>

            <SensorManagerInteractiveImage />
        </div>
    );
};
