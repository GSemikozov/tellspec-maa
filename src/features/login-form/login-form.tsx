import React, { useState } from 'react';
import { IonItem, IonList, IonText, useIonRouter } from '@ionic/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { CustomInput } from '@ui/input';
import { CustomButton } from '@ui/button';
import { userAsyncActions, userSelectors } from '@entities/user';
import { routesMapping } from '@app/routes';

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
    const [visible, setVisibility] = useState(false);

    const ionRouter = useIonRouter();

    const inputRef = React.useRef(defaultValues);

    const isFetching = useSelector(userSelectors.isUserFetching);
    const { register, formState, handleSubmit } = useForm<FieldValues>({
        defaultValues,
        mode: 'onSubmit',
    });

    const { errors } = formState;

    const onSubmit: SubmitHandler<FieldValues> = async data => {
        try {
            await dispatch(userAsyncActions.login(data)).unwrap();

            ionRouter.push(routesMapping.home);
        } catch (error) {
            console.log(error);
        }
    };

    const togglePasswordVisibility = (e: any) => {
        e.preventDefault();
        setVisibility(prev => !prev);
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
                    <div style={{ position: 'relative', width: '100%' }}>
                        <CustomInput
                            {...inputRef}
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
                            {visible ? (
                                <svg
                                    width='22'
                                    height='22'
                                    viewBox='0 0 22 22'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M20.0933 10.6333C18.2416 6.33413 14.7583 3.66663 10.9999 3.66663C7.24161 3.66663 3.75827 6.33413 1.90661 10.6333C1.85613 10.7489 1.83008 10.8738 1.83008 11C1.83008 11.1261 1.85613 11.251 1.90661 11.3666C3.75827 15.6658 7.24161 18.3333 10.9999 18.3333C14.7583 18.3333 18.2416 15.6658 20.0933 11.3666C20.1437 11.251 20.1698 11.1261 20.1698 11C20.1698 10.8738 20.1437 10.7489 20.0933 10.6333V10.6333ZM10.9999 16.5C8.09411 16.5 5.34411 14.4008 3.75827 11C5.34411 7.59913 8.09411 5.49996 10.9999 5.49996C13.9058 5.49996 16.6558 7.59913 18.2416 11C16.6558 14.4008 13.9058 16.5 10.9999 16.5ZM10.9999 7.33329C10.2747 7.33329 9.56583 7.54834 8.96285 7.95124C8.35987 8.35414 7.8899 8.92679 7.61238 9.59679C7.33486 10.2668 7.26225 11.004 7.40373 11.7153C7.5452 12.4266 7.89442 13.0799 8.40721 13.5927C8.92001 14.1055 9.57334 14.4547 10.2846 14.5962C10.9959 14.7377 11.7331 14.665 12.4031 14.3875C13.0731 14.11 13.6458 13.64 14.0487 13.037C14.4516 12.4341 14.6666 11.7252 14.6666 11C14.6666 10.0275 14.2803 9.09487 13.5927 8.40723C12.905 7.7196 11.9724 7.33329 10.9999 7.33329V7.33329ZM10.9999 12.8333C10.6373 12.8333 10.2829 12.7258 9.98139 12.5243C9.6799 12.3229 9.44492 12.0365 9.30616 11.7015C9.1674 11.3665 9.13109 10.9979 9.20183 10.6423C9.27257 10.2867 9.44718 9.95999 9.70358 9.7036C9.95997 9.4472 10.2866 9.27259 10.6423 9.20185C10.9979 9.13111 11.3665 9.16742 11.7015 9.30618C12.0365 9.44494 12.3229 9.67992 12.5243 9.98141C12.7257 10.2829 12.8333 10.6374 12.8333 11C12.8333 11.4862 12.6401 11.9525 12.2963 12.2963C11.9525 12.6401 11.4862 12.8333 10.9999 12.8333Z'
                                        fill='#E503B0'
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width='22'
                                    height='22'
                                    viewBox='0 0 22 22'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M10.0283 5.57334C10.3499 5.52405 10.6747 5.49954 11 5.50001C13.915 5.50001 16.6558 7.59917 18.2508 11C18.0069 11.5175 17.7314 12.0196 17.4258 12.5033C17.3288 12.6535 17.2779 12.8287 17.2792 13.0075C17.2812 13.2076 17.3486 13.4014 17.4712 13.5596C17.5937 13.7177 17.7646 13.8315 17.9578 13.8834C18.151 13.9353 18.3559 13.9226 18.5412 13.8472C18.7265 13.7718 18.8821 13.6379 18.9842 13.4658C19.4113 12.7948 19.7823 12.0896 20.0933 11.3575C20.1425 11.2431 20.1679 11.1199 20.1679 10.9954C20.1679 10.8709 20.1425 10.7477 20.0933 10.6333C18.2417 6.33417 14.7583 3.66667 11 3.66667C10.5698 3.66451 10.1403 3.70132 9.71667 3.77667C9.5963 3.79714 9.48113 3.84111 9.37774 3.90609C9.27436 3.97106 9.18479 4.05576 9.11414 4.15535C9.04349 4.25494 8.99314 4.36747 8.96598 4.48652C8.93882 4.60557 8.93538 4.7288 8.95584 4.84917C8.9763 4.96955 9.02028 5.08472 9.08525 5.1881C9.15023 5.29149 9.23493 5.38106 9.33452 5.45171C9.43411 5.52236 9.54664 5.5727 9.66569 5.59987C9.78473 5.62703 9.90796 5.63047 10.0283 5.61001V5.57334ZM3.40084 2.09917C3.31537 2.01371 3.21391 1.94591 3.10224 1.89965C2.99057 1.8534 2.87088 1.82959 2.75001 1.82959C2.62914 1.82959 2.50945 1.8534 2.39778 1.89965C2.28611 1.94591 2.18464 2.01371 2.09917 2.09917C1.92656 2.27179 1.82959 2.5059 1.82959 2.75001C1.82959 2.99412 1.92656 3.22823 2.09917 3.40084L4.94084 6.23334C3.64428 7.48141 2.61238 8.97783 1.90667 10.6333C1.8562 10.749 1.83015 10.8738 1.83015 11C1.83015 11.1262 1.8562 11.251 1.90667 11.3667C3.75834 15.6658 7.24167 18.3333 11 18.3333C12.6474 18.322 14.2558 17.8315 15.6292 16.9217L18.5992 19.9008C18.6844 19.9868 18.7858 20.055 18.8975 20.1015C19.0092 20.148 19.129 20.172 19.25 20.172C19.371 20.172 19.4908 20.148 19.6025 20.1015C19.7142 20.055 19.8156 19.9868 19.9008 19.9008C19.9868 19.8156 20.055 19.7142 20.1015 19.6025C20.148 19.4908 20.172 19.371 20.172 19.25C20.172 19.129 20.148 19.0092 20.1015 18.8975C20.055 18.7858 19.9868 18.6844 19.9008 18.5992L3.40084 2.09917ZM9.23084 10.5233L11.4767 12.7692C11.3217 12.8136 11.1612 12.8352 11 12.8333C10.5138 12.8333 10.0475 12.6402 9.70364 12.2964C9.35983 11.9526 9.16667 11.4862 9.16667 11C9.1648 10.8388 9.18641 10.6783 9.23084 10.5233ZM11 16.5C8.08501 16.5 5.34417 14.4008 3.75834 11C4.35059 9.69261 5.19116 8.5127 6.23334 7.52584L7.85584 9.16667C7.47473 9.86224 7.32944 10.6626 7.44174 11.4478C7.55405 12.2329 7.91791 12.9604 8.47874 13.5213C9.03957 14.0821 9.76712 14.446 10.5523 14.5583C11.3374 14.6706 12.1378 14.5253 12.8333 14.1442L14.2908 15.5833C13.2927 16.1708 12.1581 16.4868 11 16.5Z'
                                        fill='#E503B0'
                                    />
                                </svg>
                            )}
                        </div>
                    </div>
                    <span style={{ color: 'red' }}>{errors.password?.message}</span>
                </IonItem>

                <CustomButton type='submit' expand='block' size='default' disabled={isFetching}>
                    {isFetching ? 'loading...' : 'Log in'}
                </CustomButton>
            </IonList>

            <h5 className='forgot-password'>
                <IonText>
                    Forgot your Password? <a href='/'>Click Here</a>
                </IonText>
            </h5>
        </form>
    );
};
