import React from 'react';
import { useSelector } from 'react-redux';
import { IonAvatar } from '@ionic/react';
import { getUser } from '../../model/user.selectors';

import './user.css';

export const User: React.FC = () => {
  const user = useSelector(getUser);
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className='ion-text-end user'>
      <span className='user__name'>Welcome back {fullName}!</span>
      <IonAvatar className='user__avatar'>
        <img alt={fullName} src='https://ionicframework.com/docs/img/demos/avatar.svg' />
      </IonAvatar>
    </div>
  );
};
