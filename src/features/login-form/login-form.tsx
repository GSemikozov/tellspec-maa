import React from 'react';
import { IonItem, IonList, IonText } from '@ionic/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { userAsyncActions, userSelectors } from '@entities/user';
import { CustomInput } from '@ui/input';
import { CustomButton } from '@ui/button';

import type { AppDispatch } from '@app/store';

import './login-form.css';

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

    const inputRef = React.useRef(defaultValues);

    const isFetching = useSelector(userSelectors.isUserFetching);
    const { register, formState, handleSubmit } = useForm<FieldValues>({
        defaultValues,
        mode: 'onSubmit',
    });

    const { errors } = formState;

    const onSubmit: SubmitHandler<FieldValues> = data => {
        dispatch(userAsyncActions.login(data));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonList class='ion-padding'>
                <IonItem lines='none'>
                    <CustomInput
                        {...inputRef}
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

                <IonItem lines='none'>
                    <CustomInput
                        {...inputRef}
                        label-placement='floating'
                        label='Password'
                        placeholder='Password'
                        type='password'
                        {...register('password', {
                            required: 'This is a required field',
                        })}
                    />
                    <span style={{ color: 'red' }}>{errors.password?.message}</span>
                </IonItem>

                <CustomButton type='submit' expand='block' size='default' disabled={isFetching}>
                    {isFetching ? 'loading...' : 'Log in'}
                </CustomButton>
            </IonList>

            <p className='forgot-password'>
                <IonText>
                    Forgot your Password? <a href='/'>Click Here</a>
                </IonText>
            </p>
        </form>
    );
};
