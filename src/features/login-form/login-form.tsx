import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IonItem, IonList, IonText, useIonRouter } from '@ionic/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Keyboard } from '@capacitor/keyboard';

import { PreemieInput } from '@ui/input';
import { PreemieButton } from '@ui/button';
import { userAsyncActions, userSelectors } from '@entities/user';
import { routesMapping } from '@app/routes';

import { ReactComponent as ShowIcon } from './icons/eye-open.svg';
import { ReactComponent as HideIcon } from './icons/eye-close.svg';

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
type KeyboardActions = {
    hide?: () => Promise<void> | null;
};

export const LoginForm: React.FunctionComponent<KeyboardActions> = () => {
    const [visible, setVisibility] = useState(false);
    const authError = useSelector(userSelectors.getError);

    const ionRouter = useIonRouter();

    const dispatch = useDispatch<AppDispatch>();

    const inputRef = React.useRef(defaultValues);

    const isFetching = useSelector(userSelectors.isUserFetching);

    // const requestError = useSelector(userSelectors.getError);

    const { register, formState, handleSubmit } = useForm<FieldValues>({
        defaultValues,
        mode: 'onChange',
    });

    const { errors } = formState;

    const onSubmit: SubmitHandler<FieldValues> = async data => {
        await dispatch(userAsyncActions.login(data));
        ionRouter.push(routesMapping.home);
    };

    const togglePasswordVisibility = (e: any) => {
        e.preventDefault();
        setVisibility(prev => !prev);
    };

    useEffect(() => {
        if (authError) {
            Keyboard.hide();
        }
    }, [authError]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonList class='ion-padding'>
                <IonItem lines='none'>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <PreemieInput
                            {...inputRef}
                            autocomplete='email'
                            inputmode='email'
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
                        <p style={{ color: 'red' }}>{errors.email?.message}</p>
                    </div>
                </IonItem>

                <IonItem lines='none'>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <div style={{ position: 'relative' }}>
                            <PreemieInput
                                {...inputRef}
                                autocomplete='current-password'
                                label-placement='floating'
                                label='Password'
                                placeholder='Password'
                                type={visible ? 'text' : 'password'}
                                {...register('password', {
                                    required: 'This is a required field',
                                })}
                            />

                            <div
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    height: '22px',
                                    zIndex: '10',
                                }}
                                onClick={togglePasswordVisibility}
                            >
                                {visible ? <HideIcon /> : <ShowIcon />}
                            </div>
                        </div>
                        <p style={{ color: 'red' }}>{errors.password?.message}</p>
                    </div>
                </IonItem>

                {authError ? <div className='error'>{authError}</div> : null}

                {/* {requestError ? <div className='error'>{requestError}</div> : null} */}

                <PreemieButton type='submit' expand='block' size='default' disabled={isFetching}>
                    {isFetching ? 'loading...' : 'Log in'}
                </PreemieButton>
            </IonList>

            <h5 className='forgot-password'>
                <IonText>
                    Forgot your Password?{' '}
                    <NavLink to={routesMapping.forgetPassword}>Click Here</NavLink>
                </IonText>
            </h5>
        </form>
    );
};
