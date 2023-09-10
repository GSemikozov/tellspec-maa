import React from 'react';
import { IonChip, IonIcon, IonItem, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { useSelector } from 'react-redux';

import { Layout } from '@widgets/layout';
import { CustomButton } from '@ui/button';
import { groupsSelectors } from '@entities/groups';

import TickIcon from '../../../assets/icons/chip-tick-icon.svg';
import CloseIcon from '../../../assets/icons/close-icon.svg';
import SettingsIcon from '../../../assets/images/settings-icon-selected.png';
import TargetIcon from '../../../assets/icons/target-pink.svg';

import './settings.css';

import type { IFreezer } from '@entities/groups/model/groups.types';

export const SettingsPage: React.FC = () => {
    const freezersList = useSelector(groupsSelectors.getFreezers);
    const ExpirationMonth = ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months'];

    return (
        <Layout>
            <div className='settings-wrapper'>
                <IonItem lines='none'>
                    <img src={SettingsIcon} className='settings-icon' />
                    <h4>
                        <IonText className='ion-padding'>Settings</IonText>
                    </h4>
                </IonItem>
                <div className='settings-title'>
                    <p>
                        <IonText>Preemie Sensor</IonText>
                    </p>
                    <span className='calibrate-sensor'>
                        <button>
                            Calibrate Sensor <img src={TargetIcon} />
                        </button>
                    </span>
                </div>
                <div className='options'>
                    <p>
                        <IonText>Connected to</IonText>
                    </p>
                </div>
                <div className='line' />
                <div className='options'>
                    <p>
                        <IonText>Connect another Sensor</IonText>
                    </p>
                    <button className='add-button'>ADD</button>
                </div>
                <div className='settings-title'>
                    <p>
                        <IonText>Expressed Milk</IonText>
                    </p>
                </div>
                <div className='options'>
                    <p>
                        <IonText>Expiring Date</IonText>
                    </p>
                    <IonSelect label='Milk Expiration Date' label-placement='floating'>
                        {ExpirationMonth.map(month => (
                            <IonSelectOption value={month}>{month}</IonSelectOption>
                        ))}
                    </IonSelect>
                </div>
                <div className='settings-title'>
                    <p>
                        <IonText>Storage Management</IonText>
                    </p>
                </div>
                <div className='options'>
                    <p>
                        <IonText>Available storages</IonText>
                    </p>
                    <div className='available-storage-chip'>
                        {freezersList.map((freezer: IFreezer) => (
                            <IonChip key={freezer.freezer_id}>
                                <IonIcon icon={TickIcon} />
                                {freezer.name}
                                <button style={{ background: 'none' }} className='close-button'>
                                    <IonIcon icon={CloseIcon} />
                                </button>
                            </IonChip>
                        ))}
                    </div>
                </div>
                <div className='line' />
                <div className='options'>
                    <p>
                        <IonText>Disabled storages</IonText>
                    </p>
                </div>
                <div className='line' />
                <div className='options'>
                    <p>
                        <IonText>Add another Storage</IonText>
                    </p>
                    <button className='add-button'>ADD</button>
                    {/* <CustomInput
                            type="text"
                            label-placement="floating"
                            label="Add Storage"
                            /> */}
                </div>
                <div className='line' />
                <div className='button-wrapper'>
                    <CustomButton fill='outline'>CANCEL</CustomButton>
                    <CustomButton>SAVE CHANGES</CustomButton>
                </div>
            </div>
        </Layout>
    );
};
