import { IonCol, IonGrid, IonRow, IonText } from '@ionic/react';

import { classname } from '@shared/utils';

import type { Milk } from '@entities/milk';

import './report-info.css';

const cn = classname('report-info');

type ReportInfoProps = {
    milkInfo: Milk[];
};

export const ReportInfo: React.FunctionComponent<ReportInfoProps> = ({ milkInfo }) => {
    if (milkInfo.length === 0 || !milkInfo) {
        return null;
    }

    const [milk] = milkInfo;
    const sensitiveData = milk.sensitive_data;

    return (
        <IonGrid className={cn()}>
            <IonRow className='ion-margin'>
                <IonCol size='5' className={cn('columns')}>
                    <div className={cn('segment')}>
                        <p>
                            <IonText>Milk ID:</IonText>
                            <IonText>{milk.milk_id}</IonText>
                        </p>
                    </div>

                    <div className={cn('segment')}>
                        <p>
                            <IonText>Donor ID:</IonText>
                            <IonText>{sensitiveData.sourceId}</IonText>
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

                <IonCol size='5' className={cn('columns')}>
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
                                <IonText>{sensitiveData.storageFreezer}</IonText>
                            </p>
                        </div>
                    ) : null}
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};
