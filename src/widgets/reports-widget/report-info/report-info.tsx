import { IonCol, IonGrid, IonRow, IonText } from '@ionic/react';


import { classname } from '@shared/utils';

import type { Milk } from '@entities/milk';

import './report-info.css';
import { useDispatch, useSelector } from 'react-redux';
import { donorsAsyncActions, donorsSelectors } from '@entities/donors';
import { IDonor } from '@entities/donors/model/donors.types';
import { IFreezer, selectGroupFreezers } from '@entities/groups';
import React from 'react';
import { AppDispatch } from '@app/store';


import './report-info.css';

const cn = classname('report-info');

type ReportInfoProps = {
    milkInfo: Milk[];
};

export const ReportInfo: React.FunctionComponent<ReportInfoProps> = ({ milkInfo }) => {
    const donorsList = useSelector(donorsSelectors.getAllDonors);
    const freezersList = useSelector(selectGroupFreezers);

    if (milkInfo.length === 0 || !milkInfo) {
        return null;
    }
    const dispatch = useDispatch<AppDispatch>();

   
    // React.useEffect(() => {
    //     const fetchDonorsRequest = {
    //         completeData: true,
    //         showArchived: false,
    //     };

    //     dispatch(donorsAsyncActions.fetchDonors(fetchDonorsRequest));
    // }, []);

    const [milk] = milkInfo;
    const sensitiveData = milk.sensitive_data;

    return (
        <IonGrid className={cn()}>
            <IonRow className={`ion-margin ${cn('columns')}`}>
                <IonCol size='6' className={cn('column')}>
                    <div className={cn('segment')}>
                        <p>
                            <IonText>Milk ID:</IonText>
                            <IonText>{milk.milk_id}</IonText>
                        </p>
                    </div>

                    <div className={cn('segment')}>
                        <p>
                            <IonText>Donor ID:</IonText>
                            {donorsList.map((donor: IDonor) => {
                                if (donor.uuid === sensitiveData.sourceId) {
                                    return (
                                        <IonText key={donor.uuid} className={cn('donor')}>
                                            {`${donor.sensitive_data.name}  ${donor.sensitive_data.surname}`}
                                        </IonText>
                                    );
                                }
                                return null;
                            })}
                        </p>
                    </div>

                    {sensitiveData.infantDeliveryDate ? (
                        <div className={cn('segment')}>
                            <p>
                                <IonText>Infant delivery date:</IonText>
                                <IonText>{sensitiveData.infantDeliveryDate}</IonText>
                            </p>
                        </div>
                    ) : null}

                    {sensitiveData.expirationDate ? (
                        <div className={cn('segment')}>
                            <p>
                                <IonText>Milk expression date:</IonText>
                                <IonText>{sensitiveData.expressionDate}</IonText>
                            </p>
                        </div>
                    ) : null}
                </IonCol>

                <IonCol size='6' className={cn('column')}>
                    {sensitiveData.expirationDate ? (
                        <div className={cn('segment')}>
                            <p>
                                <IonText>Milk expiration date:</IonText>
                                <IonText>{sensitiveData.expirationDate}</IonText>
                            </p>
                        </div>
                    ) : null}

                    {sensitiveData.receivedDate ? (
                        <div className={cn('segment')}>
                            <p>
                                <IonText>Date received:</IonText>
                                <IonText>{sensitiveData.receivedDate}</IonText>
                            </p>
                        </div>
                    ) : null}

                    {sensitiveData.storageFreezer ? (
                        <div className={cn('segment')}>
                            <p>
                                <IonText>Storage Freezer:</IonText>
                                {freezersList.map((freezer: IFreezer) => {
                                    if (freezer.freezer_id === sensitiveData.storageFreezer) {
                                        return (
                                            <IonText
                                                key={freezer.freezer_id}
                                                className={cn('donor')}
                                            >
                                                {freezer.name}
                                            </IonText>
                                        );
                                    }
                                    return null;
                                })}
                            </p>
                        </div>
                    ) : null}
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};
