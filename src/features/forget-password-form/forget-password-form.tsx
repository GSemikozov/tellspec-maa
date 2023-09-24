import React from 'react';
import { IonItem, IonList, IonText } from '@ionic/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { usePreemieToast } from '@shared/ui';
import { PreemieInput } from '@ui/input';
import { CustomButton } from '@ui/button';
import { userAsyncActions, userSelectors } from '@entities/user';
import { routesMapping } from '@app/routes.ts';

import type { AppDispatch } from '@app/store';

import './forget-password-form.css';

interface FieldValues {
    email: string;
}

const defaultValues = {
    email: '',
};

export const ForgetPasswordForm: React.FunctionComponent = () => {
    const [presentToast] = usePreemieToast();
    const dispatch = useDispatch<AppDispatch>();
    const isFetching = useSelector(userSelectors.isUserFetching);
    const requestError = useSelector(userSelectors.getError);
    const { register, formState, handleSubmit } = useForm<FieldValues>({
        defaultValues,
        mode: 'all',
    });

    const { errors } = formState;

    const onSubmit: SubmitHandler<FieldValues> = async data => {
        await dispatch(userAsyncActions.resetPassword(data.email));
        await presentToast({
            type: 'success',
            message: 'Password reset e-mail has been sent.',
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonList class='ion-padding'>
                <IonItem lines='none'>
                    <PreemieInput
                        label-placement='floating'
                        label='Email'
                        placeholder='Email'
                        {...register('email', {
                            required: 'This is a required field',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: 'invalid email address',
                            },
                        })}
                    />
                    <span style={{ color: 'red' }}>{errors.email?.message}</span>
                </IonItem>

                {requestError ? <div className='error'>{requestError}</div> : null}

                <CustomButton type='submit' expand='block' size='default' disabled={isFetching}>
                    {isFetching ? 'loading...' : 'Reset password'}
                </CustomButton>

                <h5 className='forgot-password'>
                    <IonText>
                        <NavLink to={routesMapping.login}>Back to login</NavLink>
                    </IonText>
                </h5>
            </IonList>
        </form>
    );
};
