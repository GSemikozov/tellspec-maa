import React from 'react';
import {
    IonButton,
    IonChip,
    IonCol,
    // IonChip,
    IonContent,
    IonGrid,
    IonIcon,
    // IonIcon,
    IonItem,
    IonPage,
    IonRow,
    // IonSelect,
    // IonSelectOption,
    IonText,
} from '@ionic/react';
// import { useSelector } from 'react-redux';

import { Layout } from '@widgets/layout';
import { CustomButton } from '@ui/button';
// import { groupsSelectors } from '@entities/groups';

import TickIcon from '../../../assets/icons/chip-tick-icon.svg';
import CloseIcon from '../../../assets/icons/close-icon.svg';
import SettingsIcon from '../../../assets/images/settings-icon-selected.png';

import './sensor.page.css';

export const SensorPage: React.FC = () => {
    return (
        <IonPage>
            <IonContent>
                <Layout rightSideBar={null}>
                    <div className='sensor-wrapper'>
                        <IonItem lines='none'>
                            <img src={SettingsIcon} />
                            <h2>
                                <IonText>Preemie Sensor</IonText>
                            </h2>
                        </IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol className='ion-margin-top ion-margin-end ion-margin-start col-wrapper'>
                                    <div className='sensor-title top-col-wrapper'>
                                        <p>
                                            <IonText>Sensor</IonText>
                                        </p>
                                        <div className='available-storage-chip'>
                                            <IonChip>
                                                <IonIcon icon={TickIcon} />
                                                <IonText>Serial number</IonText>
                                                <button
                                                    style={{ background: 'none' }}
                                                    className='close-button'
                                                >
                                                    <IonIcon icon={CloseIcon} />
                                                </button>
                                            </IonChip>
                                        </div>
                                    </div>
                                    <div className='options'>
                                        <p>
                                            <IonText>Humidity</IonText>
                                        </p>
                                        <span className='column-data'>
                                            <h5>
                                                <IonText>57.95% RH</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                    <div className='line' />

                                    <div className='options'>
                                        <p>
                                            <IonText>Temperature</IonText>
                                        </p>
                                        <span className='column-data'>
                                            <h5>
                                                <IonText>28.0°C</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                </IonCol>
                                <IonCol className='ion-margin-top ion-margin-end ion-margin-start col-wrapper'>
                                    <div className='sensor-title'>
                                        <p>
                                            <IonText>Scans</IonText>
                                        </p>
                                    </div>
                                    <div className='options'>
                                        <p>
                                            <IonText>Number of scans done so far</IonText>
                                        </p>
                                        <span className='column-data'>
                                            <h5>
                                                <IonText>28</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                    <div className='line' />
                                    <div className='options'>
                                        <p>
                                            <IonText>Number of warm up scans required</IonText>
                                        </p>
                                        <span className='column-data'>
                                            <h5>
                                                <IonText>4</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol className='ion-margin-top ion-margin-end ion-margin-start col-wrapper'>
                                    <div className='sensor-title'>
                                        <p>
                                            <IonText>Configuration</IonText>
                                        </p>
                                    </div>
                                    <div className='options'>
                                        <p>
                                            <IonText>Active configuration</IonText>
                                        </p>
                                        <span className='column-data'>
                                            <IonButton>CHANGE</IonButton>
                                        </span>
                                    </div>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol
                                    size='11.6'
                                    className='title-wrapper'
                                >
                                    <div className='sensor-title'>
                                        <p>
                                            <IonText>Calibration</IonText>
                                        </p>
                                    </div>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol
                                    size='5.5'
                                    className='ion-margin-top ion-margin-end ion-margin-start col-wrapper '
                                >
                                    <div className='options'>
                                        <p>
                                            <IonText>Last Calibration Date</IonText>
                                        </p>
                                        <span className='column-data'>
                                            <h5>
                                                <IonText>DD/MM/YYYY</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                    <div className='line' />
                                    <div className='options'>
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
                                <IonCol
                                    size='5.5'
                                    className='ion-margin-top ion-margin-end ion-margin-start col-wrapper'
                                >
                                    <div className='options'>
                                        <p>
                                            <IonText>Last wavelength calibration</IonText>
                                        </p>
                                        <span className='column-data'>
                                            <h5>
                                                <IonText>DD/MM/YYYY</IonText>
                                            </h5>
                                        </span>
                                    </div>
                                    <div className='line' />
                                    <div className='options'>
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

                            <div className='settings-button-wrapper'>
                                <CustomButton fill='outline' className='settings-button'>
                                    CANCEL
                                </CustomButton>
                                <CustomButton className='settings-button'>
                                    SAVE CHANGES
                                </CustomButton>
                            </div>
                        </IonGrid>
                    </div>
                </Layout>
            </IonContent>
        </IonPage>
    );
};
