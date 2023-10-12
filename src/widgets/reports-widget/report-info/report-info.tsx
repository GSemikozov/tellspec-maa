import React from 'react';
import { IonCol, IonGrid, IonRow, IonText } from '@ionic/react';

import { classname } from '@shared/utils';

import type { IFreezer } from '@entities/groups';
import type { IDonor } from '@entities/donors';
import type { Milk } from '@entities/milk';

import './report-info.css';

const cn = classname('report-info');

type ReportInfoProps = {
    milkInfo: Milk[];
    donor?: IDonor;
    freezer?: IFreezer;
};

export const ReportInfo: React.FunctionComponent<ReportInfoProps> = props => {
    const { milkInfo, donor, freezer } = props;

    if (milkInfo.length === 0 || !milkInfo) {
        return null;
    }

    const [milk] = milkInfo;
    const sensitiveData = milk.sensitive_data;

    console.log('ReportInfo milkInfo', milkInfo);

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

                    {donor ? (
                        <div className={cn('segment')}>
                            <p>
                                <IonText>Donor ID:</IonText>
                                <IonText key={donor.uuid} className={cn('donor')}>
                                    {`${donor.sensitive_data.name}  ${donor.sensitive_data.surname}`}
                                </IonText>
                            </p>
                        </div>
                    ) : null}

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

                    {sensitiveData.storageFreezer && freezer ? (
                        <div className={cn('segment')}>
                            <p>
                                <IonText>Storage Freezer:</IonText>
                                <IonText className={cn('donor')}>{freezer?.name}</IonText>
                                {/* {freezersList.map((freezer: IFreezer) => {
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
                                })} */}
                            </p>
                        </div>
                    ) : null}
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};
