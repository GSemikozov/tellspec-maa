import { IonCol, IonGrid, IonInput, IonRow, IonText } from '@ionic/react';
import { classname } from '@shared/utils';

import './report-info.css';
// import { useSelector } from 'react-redux';

const cn = classname('report-info');

const defaultValues = {
    milkId: '123',
    donorId: '321',
    infantDeliveryDate: '04/10/2023',
    milkExpressionDate: '',
    milkExpirationDate: '',
    receivedDate: '',
    storageFreezer: '',
    storageCompartment: '',
};

export const ReportInfo = () => {
    return (
        <IonGrid className={cn()}>
            <IonRow className='ion-margin'>
                <IonCol size='5' className={cn('columns')}>
                    <div className={cn('segment')}>
                        <p>
                            <IonText>Milk ID:</IonText>
                            <IonText>{defaultValues.milkId}</IonText>
                        </p>
                    </div>
                    <div className={cn('segment')}>
                        <p>
                            <IonText>Donor ID:</IonText>
                            <IonText>{defaultValues.donorId}</IonText>
                        </p>
                    </div>
                    <div className={cn('segment')}>
                        <p>
                            <IonText>Infant delivery date:</IonText>
                            <IonText>{defaultValues.infantDeliveryDate}</IonText>
                        </p>
                    </div>
                    <div className={cn('segment')}>
                        <p>
                            <IonText>Milk expression date:</IonText>
                            <IonText>{defaultValues.milkExpressionDate}</IonText>
                        </p>
                    </div>
                </IonCol>
                <IonCol size='5' className={cn('columns')}>
                    <div className={cn('segment')}>
                        <p>
                            <IonText>Milk expiration date:</IonText>
                            <IonText>{defaultValues.milkExpirationDate}</IonText>
                        </p>
                    </div>
                    <div className={cn('segment')}>
                        <p>
                            <IonText>Date received:</IonText>
                            <IonText>{defaultValues.receivedDate}</IonText>
                        </p>
                    </div>
                    <div className={cn('segment')}>
                        <p>
                            <IonText>Storage Freezer:</IonText>
                            <IonText>{defaultValues.storageFreezer}</IonText>
                        </p>
                    </div>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};
