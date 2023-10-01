import React from 'react';
import { IonChip, IonContent, IonPage, IonText } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { TargetOfflineIcon, SensorIcon } from '@ui/icons';
import { PreemieButton } from '@ui/button';
import { classname } from '@shared/utils';
import { PageArea } from '@shared/ui';
import {
    getSensorScanner,
    getSensorCalibration,
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

    const handleClickCalibrate = () => calibrateSensor(currentDevice);

    const activeCalibration = currentDevice.activeCal;

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
                                                <IonText className={cn('chip-text')}>
                                                    {currentDevice.serial}
                                                </IonText>
                                            </IonChip>
                                        </div>
                                    </div>

                                    {currentDevice.humidity ? (
                                        <div className={cn('section-option')}>
                                            <p>Humidity</p>

                                            <div
                                                className={cn('section-option-action', {
                                                    information: true,
                                                })}
                                            >
                                                {Number(currentDevice.humidity).toFixed()}% RH
                                            </div>
                                        </div>
                                    ) : null}

                                    {currentDevice.temperature ? (
                                        <div className={cn('section-option')}>
                                            <p>Temperature</p>

                                            <div
                                                className={cn('section-option-action', {
                                                    information: true,
                                                })}
                                            >
                                                {currentDevice.temperature}°C
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className={cn('section-option')}>
                                        <p>Paired with</p>

                                        <div
                                            className={cn('section-option-action', {
                                                information: true,
                                            })}
                                        >
                                            {pairedDevices.map(pairedDevice => (
                                                <div key={pairedDevice.uuid}>
                                                    {pairedDevice.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={cn('section')}>
                                    <div className={cn('section-option', { header: true })}>
                                        <p>Scans</p>
                                    </div>

                                    {/* <div className={cn('section-option')}>
                                        <p>Number of warm up scans required</p>

                                        <div
                                            className={cn('section-option-action', {
                                                information: true,
                                            })}
                                        >
                                            4
                                        </div>
                                    </div> */}

                                    {sensorScannerData ? (
                                        <div className={cn('section-option')}>
                                            <p>Number of scans</p>

                                            <div
                                                className={cn('section-option-action', {
                                                    information: true,
                                                })}
                                            >
                                                {sensorScannerData.number_scans}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/** TODO: available only for admins */}
                            {/* <div className={cn('section-grid')}>
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
                            </div> */}

                            <div className={cn('section-grid')}>
                                <div className={cn('section')}>
                                    <div className={cn('section-option', { header: true })}>
                                        <p>Calibration</p>

                                        <div className={cn('section-option-action')}>
                                            <IonChip
                                                className={cn('calibrate-sensor')}
                                                disabled={calibrateSensorLoading}
                                                onClick={handleClickCalibrate}
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

                                    {activeCalibration ? (
                                        <div className={cn('section-option', { fluid: true })}>
                                            <p>Spectrum of last calibration</p>

                                            <SensorCalibrationChart
                                                calibration={activeCalibration}
                                            />
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
