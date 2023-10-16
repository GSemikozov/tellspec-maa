import React from 'react';
import { IonChip, IonContent, IonPage, IonSelect, IonSelectOption } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import { SettingsIcon } from '@ui/icons';
import { PageArea } from '@shared/ui';
import { classname } from '@shared/utils';
import { userSelectors } from '@entities/user';
import { selectGroupFreezers, fetchGroup } from '@entities/groups';
import { Layout } from '@widgets/layout';
import { AppDispatch } from '@app';

import './settings.css';

const cn = classname('settings');

const expirationMonth = ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months'];

export const SettingsPage: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const groupId = useSelector(userSelectors.selectGroupId);

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
                                    {/* <div className={cn('section-option', { header: true })}>
                                        <p>About</p>
                                    </div> */}

                                    {/* <div className={cn('section-option')}>
                                        {/* <p>Hardware data</p> */}
                                    {/* <p>-</p>  */}

                                    <div className={cn('section-option-action')}></div>
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
                                        <IonSelect disabled label-placement='floating'>
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
                                            <IonChip key={freezer.freezer_id} disabled={true}>
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
                                <div className={cn('section')}>
                                    <div className={cn('apk-number')}>MAA version: 16/10/23.v1</div>
                                </div>
                            </div>
                            {/* </div> */}
                        </PageArea.Main>
                    </PageArea>
                </Layout>
            </IonContent>
        </IonPage>
    );
};
