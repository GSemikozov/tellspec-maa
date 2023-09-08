import { IonCol } from '@ionic/react';

import { classname } from '@shared/utils';
import { SensorStatusBar } from '@entities/sensor';
import { UserInfo } from '@entities/user';

import './header.css';

const cn = classname('header');

export const Header: React.FunctionComponent = () => {
    return (
        <div className={cn()}>
            <IonCol size='5' className={cn('user-info')}>
                <UserInfo />
            </IonCol>

            <IonCol size='7' className={cn('status')}>
                <SensorStatusBar />
            </IonCol>
        </div>
    );
};
