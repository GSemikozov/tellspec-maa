import React from 'react';
import {
    IonButton,
    IonChip,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonItem,
    IonPage,
    IonRow,
    IonText,
} from '@ionic/react';
// import { useSelector } from 'react-redux';
import { classname } from '@shared/utils';

import { Layout } from '@widgets/layout';
import { CustomButton } from '@ui/button';
// import { groupsSelectors } from '@entities/groups';

import TickIcon from '../../../assets/icons/chip-tick-icon.svg';

const cn = classname('sensor-page');

import './sensor.page.css';
import { SensorIcon, TargetOfflineIcon } from '@ui/icons';

export const SensorPage: React.FC = () => {
    return (
        <IonPage>
            <IonContent>
                <Layout rightSideBar={null}>
                    <div className={cn()}>
                        <div className={cn('title-wrapper')}>
                            <IonItem lines='none'>
                                <SensorIcon size={32} color='#E503B0' />
                                <h2>
                                    <IonText>Preemie Sensor</IonText>
                                </h2>
                            </IonItem>
                            <div className={cn('button-wrapper')}>
                                <CustomButton>Disconnect sensor</CustomButton>
                                <CustomButton>SAVE CHANGES</CustomButton>
                                <CustomButton fill='outline'>CANCEL</CustomButton>
                            </div>
                        </div>
                        <IonGrid>
                            <IonRow>
                                <IonCol className={cn('col-wrapper')}>
                                    <div className={cn('title')}>
                                        <p>
                                            <IonText>Sensor</IonText>
                                        </p>
                                        <div className={cn('available-storage-chip')}>
                                            <IonChip>
                                                <IonIcon icon={TickIcon} />
                                                <IonText>Serial number</IonText>
                                            </IonChip>
                                        </div>
                                    </div>
                                    <div className={cn('options')}>
                                        <p>
                                            <IonText>Humidity</IonText>
                                        </p>
                                        <span className={cn('column-data')}>
                                            <h5>
                                                <IonText>57% RH</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                    <div className={cn('line')} />

                                    <div className={cn('options')}>
                                        <p>
                                            <IonText>Temperature</IonText>
                                        </p>
                                        <span className={cn('column-data')}>
                                            <h5>
                                                <IonText>28.0°C</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                </IonCol>
                                <IonCol className={cn('col-wrapper')}>
                                    <div className={cn('title')}>
                                        <p>
                                            <IonText>Scans</IonText>
                                        </p>
                                    </div>
                                    <div className={cn('options')}>
                                        <p>
                                            <IonText>Number of scans done so far</IonText>
                                        </p>
                                        <span className={cn('column-data')}>
                                            <h5>
                                                <IonText>28</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                    <div className={cn('line')} />
                                    <div className={cn('options')}>
                                        <p>
                                            <IonText>Number of warm up scans required</IonText>
                                        </p>
                                        <span className={cn('column-data')}>
                                            <h5>
                                                <IonText>4</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol className={cn('col-wrapper')}>
                                    <div className={cn('title')}>
                                        <p>
                                            <IonText>Configuration</IonText>
                                        </p>
                                    </div>
                                    <div className={cn('options')}>
                                        <p>
                                            <IonText>Active configuration</IonText>
                                        </p>
                                        <span className={cn('column-data')}>
                                            <IonButton>CHANGE</IonButton>
                                        </span>
                                    </div>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol className={cn('col-wrapper')}>
                                    <div className={cn('title')}>
                                        <p>
                                            <IonText>Calibration</IonText>
                                        </p>
                                        <IonChip
                                            className={cn('calibrate-sensor')}
                                            // disabled={calibrateSensorLoading}
                                            // onClick={calibrateSensor}
                                        >
                                            <IonText>Calibrate sensor</IonText>

                                            <div className={cn('chip-icon')}>
                                                <TargetOfflineIcon size={20} color='currentColor' />
                                            </div>
                                        </IonChip>
                                    </div>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol className={cn('col-wrapper')}>
                                    <div className={cn('options')}>
                                        <p>
                                            <IonText>Last Calibration Date</IonText>
                                        </p>
                                        <span className={cn('column-data')}>
                                            <h5>
                                                <IonText>DD/MM/YYYY</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                    <div className={cn('line')} />
                                    <div className={cn('options')}>
                                        <p>
                                            <IonText>Spectrum of last calibration</IonText>
                                        </p>
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                    </div>
                                </IonCol>
                                <IonCol className={cn('col-wrapper')}>
                                    <div className={cn('options')}>
                                        <p>
                                            <IonText>Last wavelength calibration</IonText>
                                        </p>
                                        <span className={cn('column-data')}>
                                            <h5>
                                                <IonText>DD/MM/YYYY</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                    <div className={cn('line')} />
                                    <div className={cn('options')}>
                                        <p>
                                            <IonText>
                                                Spectrum of last wavelength calibration
                                            </IonText>
                                        </p>
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <span className=''></span>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                </Layout>
            </IonContent>
        </IonPage>
    );
};
