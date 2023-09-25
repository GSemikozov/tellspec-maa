import React from 'react';
import { IonChip, IonContent, IonPage, IonText } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { TickIcon, TargetOfflineIcon, SensorIcon, CloseIcon } from '@ui/icons';
import { PreemieButton } from '@ui/button';
import { classname } from '@shared/utils';
import { PageArea } from '@shared/ui';
import {
    getSensorScanner,
    getSensorCalibration,
    selectSensorCalibration,
    selectSensorDevice,
    useCalibrateSensor,
    selectSensorScannerData,
    SensorCalibrationChart,
    useRemoveSensor,
    selectSensorPairedDevices,
} from '@entities/sensor';
import { Layout } from '@widgets/layout';

import type { AppDispatch } from '@app';

import './sensor.page.css';

const cn = classname('sensor-page');

export const SensorPage: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [calibrateSensor, { loading: calibrateSensorLoading }] = useCalibrateSensor();
    const [removeSensor] = useRemoveSensor();

    const currentDevice = useSelector(selectSensorDevice);
    const sensorScannerData = useSelector(selectSensorScannerData);
    const sensorCalibration = useSelector(selectSensorCalibration);

    const pairedDevices = useSelector(selectSensorPairedDevices);

    React.useEffect(() => {
        dispatch(getSensorScanner());
        dispatch(getSensorCalibration());
    }, []);

    const handleRemoveSensor = () => {
        if (!currentDevice) {
            return;
        }

        removeSensor(currentDevice.uuid);
    };

    if (!currentDevice) {
        return (
            <IonPage>
                <IonContent>
                    <Layout rightSideBar={null}>
                        <PageArea>
                            <PageArea.Header
                                className={cn('header')}
                                title='Preemie Sensor not found'
                                icon={<SensorIcon size={32} color='#E503B0' />}
                            />
                        </PageArea>
                    </Layout>
                </IonContent>
            </IonPage>
        );
    }

    console.log('currentDevice', currentDevice);
    console.log('sensorScannerData', sensorScannerData);
    console.log('sensorCalibration', sensorCalibration);

    return (
        <IonPage>
            <IonContent>
                <Layout rightSideBar={null}>
                    <PageArea>
                        <PageArea.Header
                            className={cn('header')}
                            title='Preemie Sensor'
                            icon={<SensorIcon size={32} color='#E503B0' />}
                            actions={
                                <>
                                    <PreemieButton onClick={handleRemoveSensor}>
                                        Disconnect sensor
                                    </PreemieButton>
                                </>
                            }
                        />

                        <PageArea.Main>
                            <div className={cn('section-grid')}>
                                <div className={cn('section')}>
                                    <div className={cn('section-option', { header: true })}>
                                        <p>Sensor</p>

                                        <div className={cn('section-option-action')}>
                                            <IonChip>
                                                <div className={cn('chip-icon', { start: true })}>
                                                    <TickIcon size={18} color='currentColor' />
                                                </div>

                                                <IonText className={cn('chip-text')}>
                                                    {currentDevice.serial}
                                                </IonText>
                                            </IonChip>
                                        </div>
                                    </div>

                                    <div className={cn('section-option')}>
                                        <p>Pga</p>

                                        <div
                                            className={cn('section-option-action', {
                                                information: true,
                                            })}
                                        >
                                            {/** @ts-ignore */}
                                            {currentDevice.pga || 16}% RH
                                        </div>
                                    </div>

                                    <div className={cn('section-option')}>
                                        <p>Humidity</p>

                                        <div
                                            className={cn('section-option-action', {
                                                information: true,
                                            })}
                                        >
                                            {currentDevice.humidity || 51}% RH
                                        </div>
                                    </div>

                                    <div className={cn('section-option')}>
                                        <p>Temperature</p>

                                        <div
                                            className={cn('section-option-action', {
                                                information: true,
                                            })}
                                        >
                                            {currentDevice.temperature || 24} °C
                                        </div>
                                    </div>

                                    <div className={cn('section-option')}>
                                        <p>Paired with</p>

                                        <div className={cn('section-option-action')}>
                                            {pairedDevices.map(pairedDevice => (
                                                <IonChip key={pairedDevice.uuid}>
                                                    <IonText
                                                        className={cn('chip-text')}
                                                        onClick={() =>
                                                            removeSensor(pairedDevice.uuid)
                                                        }
                                                    >
                                                        {pairedDevice.name}
                                                    </IonText>

                                                    <div className={cn('chip-icon')}>
                                                        <CloseIcon size={16} />
                                                    </div>
                                                </IonChip>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={cn('section')}>
                                    <div className={cn('section-option', { header: true })}>
                                        <p>Scans</p>
                                    </div>

                                    <div className={cn('section-option')}>
                                        <p>Number of warm up scans required</p>

                                        <div
                                            className={cn('section-option-action', {
                                                information: true,
                                            })}
                                        >
                                            not available
                                        </div>
                                    </div>

                                    <div className={cn('section-option')}>
                                        <p>Number of scans</p>

                                        <div
                                            className={cn('section-option-action', {
                                                information: true,
                                            })}
                                        >
                                            {/** @ts-ignore */}
                                            {currentDevice.number_scans || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cn('section-grid')}>
                                <div className={cn('section')}>
                                    <div className={cn('section-option', { header: true })}>
                                        <p>Configuration</p>
                                    </div>

                                    <div className={cn('section-option')}>
                                        <p>Active configuration</p>

                                        <div
                                            className={cn('section-option-action', {
                                                information: true,
                                            })}
                                        >
                                            {currentDevice.activeConfig}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cn('section-grid')}>
                                <div className={cn('section')}>
                                    <div className={cn('section-option', { header: true })}>
                                        <p>Calibration</p>

                                        <div className={cn('section-option-action')}>
                                            <IonChip
                                                className={cn('calibrate-sensor')}
                                                disabled={calibrateSensorLoading}
                                                onClick={calibrateSensor}
                                            >
                                                <IonText className={cn('chip-text')}>
                                                    Calibrate sensor
                                                </IonText>

                                                <div className={cn('chip-icon')}>
                                                    <TargetOfflineIcon
                                                        size={20}
                                                        color='currentColor'
                                                    />
                                                </div>
                                            </IonChip>
                                        </div>
                                    </div>

                                    {sensorScannerData ? (
                                        <div className={cn('section-option')}>
                                            <p>Last Calibration Date</p>

                                            <div
                                                className={cn('section-option-action', {
                                                    information: true,
                                                })}
                                            >
                                                {sensorScannerData.last_calibration}
                                            </div>
                                        </div>
                                    ) : null}

                                    {sensorCalibration ? (
                                        <div className={cn('section-option')}>
                                            <div>
                                                <p>Spectrum of last calibration</p>
                                                <SensorCalibrationChart
                                                    calibration={sensorCalibration}
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </PageArea.Main>
                    </PageArea>
                </Layout>
            </IonContent>
        </IonPage>
    );
};
