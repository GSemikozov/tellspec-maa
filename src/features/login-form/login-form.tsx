import React from 'react';
import { IonButton, IonInput, IonItem, IonList, IonText } from '@ionic/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { userAsyncActions, userSelectors } from '@entities/user';
import './login-form.css';

import type { AppDispatch } from '@app/store';

interface FieldValues {
    email: string;
    password: string;
}

const defaultValues = {
    email: '',
    password: '',
};

export const LoginForm: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isFetching = useSelector(userSelectors.isUserFetching);
    const { register, formState, handleSubmit } = useForm<FieldValues>({
        defaultValues,
        mode: 'onSubmit',
    });

    const { errors } = formState;

    const onSubmit: SubmitHandler<FieldValues> = data => {
        dispatch(userAsyncActions.login(data));
    };

    const getInputClassName = (id: string) => {
        const classnames = [
            'credential-input',
            'ion-touched',
            errors[id]?.message && 'ion-invalid',
        ].filter(Boolean);

        return classnames.join(' ');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonList class='ion-padding'>
                <IonItem lines='none'>
                    <IonInput
                        label-placement='floating'
                        label='Email'
                        placeholder='Email'
                        className={getInputClassName('email')}
                        errorText={errors.email?.message}
                        {...register('email', {
                            required: 'This is a required field',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: 'invalid email address',
                            },
                        })}
                    />
                </IonItem>

                <IonItem lines='none'>
                    <IonInput
                        label-placement='floating'
                        label='Password'
                        placeholder='Password'
                        type='password'
                        className={getInputClassName('password')}
                        errorText={errors.password?.message}
                        {...register('password', {
                            required: 'This is a required field',
                        })}
                    />
                </IonItem>

                <IonButton type='submit' expand='block' size='default' disabled={isFetching}>
                    {isFetching ? 'loading...' : 'Log in'}
                </IonButton>
            </IonList>

            <p className='forgot-password'>
                <IonText>
                    Forgot your Password? <a href='/'>Click Here</a>
                </IonText>
            </p>
        </form>
    );
};
