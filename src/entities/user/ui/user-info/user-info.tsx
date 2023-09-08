import React from 'react';
import { useSelector } from 'react-redux';
import { IonAvatar } from '@ionic/react';

import { classname } from '@shared/utils';
import { getUser } from '@entities/user/model/user.selectors';

import './user-info.css';

const cn = classname('user-info');

export const UserInfo: React.FunctionComponent = () => {
    const user = useSelector(getUser);
    const fullName = `${user.first_name} ${user.last_name}`;

    return (
        <div className={cn()}>
            <span className={cn('name')}>{fullName}!</span>

            <IonAvatar className={cn('avatar')}>
                <img alt={fullName} src='https://ionicframework.com/docs/img/demos/avatar.svg' />
            </IonAvatar>
        </div>
    );
};
