import React from 'react';
import { IonChip, IonContent, IonPage, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { CloseIcon, SettingsIcon, TargetOfflineIcon } from '@ui/icons';
import { PageArea } from '@shared/ui';
import { classname } from '@shared/utils';
import { userSelectors } from '@entities/user';
import { selectGroupFreezers, fetchGroup } from '@entities/groups';
import { selectSensorPairedDevices, useCalibrateSensor, useRemoveSensor } from '@entities/sensor';
import { Layout } from '@widgets/layout';
import { AppDispatch } from '@app';

import './settings.css';

const cn = classname('settings');

const expirationMonth = ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months'];

export const SettingsPage: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [calibrateSensor, { loading: calibrateSensorLoading }] = useCalibrateSensor();
    const [removeSensor] = useRemoveSensor();

    const groupId = useSelector(userSelectors.selectGroupId);

    const pairedDevices = useSelector(selectSensorPairedDevices);
    const freezersList = useSelector(selectGroupFreezers);

    React.useEffect(() => {
        dispatch(fetchGroup({ preemie_group_id: groupId }));
    }, [groupId]);

    return (
        <IonPage>
            <IonContent>
                <Layout rightSideBar={null}>
                    <PageArea>
                        <PageArea.Header
                            className={cn('header')}
                            title='Settings'
                            icon={<SettingsIcon />}
                        />

                        <PageArea.Main>
                            <div className={cn('container')}>
                                <div className={cn('section')}>
                                    <div className={cn('section-option', { header: true })}>
                                        <p>Preemie Sensor</p>

                                        <IonChip
                                            className={cn('calibrate-sensor')}
                                            disabled={calibrateSensorLoading}
                                            onClick={calibrateSensor}
                                        >
                                            <IonText className={cn('chip-text')}>
                                                Calibrate sensor
                                            </IonText>

                                            <div className={cn('chip-icon')}>
                                                <TargetOfflineIcon size={20} color='currentColor' />
                                            </div>
                                        </IonChip>
                                    </div>

                                    <div className={cn('section-option')}>
                                        <p>Paired to</p>

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

                                    <div className={cn('section-option', { disabled: true })}>
                                        <p>Pair another sensor</p>
                                    </div>
                                </div>

                                <div className={cn('section')}>
                                    <div className={cn('section-option', { header: true })}>
                                        <p>Expressed Milk</p>
                                    </div>

                                    <div className={cn('section-option', { disabled: true })}>
                                        <p>
                                            Default expiration <span>{expirationMonth[5]}</span>
                                        </p>

                                        <div className={cn('section-option-action')}>
                                            <IonSelect
                                                disabled
                                                label='Milk expiration date'
                                                label-placement='floating'
                                            >
                                                {expirationMonth.map(month => (
                                                    <IonSelectOption key={month} value={month}>
                                                        {month}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        </div>
                                    </div>
                                </div>

                                <div className={cn('section')}>
                                    <div className={cn('section-option', { header: true })}>
                                        <p>Storage Management</p>
                                    </div>

                                    <div className={cn('section-option')}>
                                        <p>Available storages</p>

                                        <div className={cn('section-option-action')}>
                                            {freezersList.map(freezer => (
                                                <IonChip key={freezer.freezer_id}>
                                                    {freezer.name}
                                                </IonChip>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={cn('section-option', { disabled: true })}>
                                        <p>Disabled storages</p>
                                    </div>

                                    <div className={cn('section-option', { disabled: true })}>
                                        <p>Add another storage</p>
                                    </div>
                                </div>
                            </div>
                        </PageArea.Main>
                    </PageArea>
                </Layout>
            </IonContent>
        </IonPage>
    );
};
