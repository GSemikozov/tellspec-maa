import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    IonAlert,
    IonButton,
    IonCol,
    IonRow,
    IonSelectOption,
    IonText,
    useIonAlert,
    useIonRouter,
} from '@ionic/react';
// import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Keyboard } from '@capacitor/keyboard';

import { PreemieSelect, PreemieInput, PreemieButton, usePreemieToast } from '@ui';
import { PageArea } from '@shared/ui';
import { classname } from '@shared/utils';
import { userSelectors } from '@entities/user';
import { selectSensorDevice } from '@entities/sensor';
import { donorsAsyncActions, donorsSelectors } from '@entities/donors';
import { fetchGroup, selectGroupCompartmentList, selectGroupFreezers } from '@entities/groups';
import { AddMilkIcon } from '@ui/icons';
import { routesMapping } from '@app/routes';
import { AppDispatch } from '@app/store';

import { addMilkFormSelectors, addMilkFormAsyncActions } from './model';
import { validationSchema, buildMilkData } from './add-milk-form.utils';

import type { IDonor } from '@entities/donors/model/donors.types';
import type { IFreezer } from '@entities/groups';
import type { AddMilkFormFieldValues } from './add-milk-form.utils';

import './add-milk-form.css';

const cn = classname('add-milk-form');

const defaultValues = {
    milkId: '',
    milkVolume: '',
    donorId: '',
    numberOfContainers: undefined,
    infantDeliveryDate: '',
    milkExpressionDate: '',
    milkExpirationDate: '',
    receivedDate: '',
    storageFreezer: '',
    storageCompartment: '',
};

export const AddMilkForm: React.FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const router = useIonRouter();

    const currentDevice = useSelector(selectSensorDevice);
    const groupId = useSelector(userSelectors.selectGroupId);
    const donorsList = useSelector(donorsSelectors.getAllDonors);
    const freezersList = useSelector(selectGroupFreezers);
    const isFetching = useSelector(addMilkFormSelectors.selectIsAddMilkFormLoading);

    const [presentAlert] = useIonAlert();
    const [presentToast] = usePreemieToast();

    const {
        register,
        trigger,
        reset,
        watch,
        getValues,
        setValue,
        formState: { errors, touchedFields, isValid },
    } = useForm<AddMilkFormFieldValues>({
        defaultValues,
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const storageFreezerValue = watch('storageFreezer');

    const compartmentList = useSelector(state =>
        selectGroupCompartmentList(state, storageFreezerValue!),
    );

    React.useEffect(() => {
        const fetchDonorsRequest = {
            completeData: true,
            showArchived: false,
        };

        dispatch(donorsAsyncActions.fetchDonors(fetchDonorsRequest));
        dispatch(fetchGroup({ preemie_group_id: groupId }));
    }, []);

    const handleMilkExpressionDateChange = e => {
        const receivedDate = e.target.value;

        try {
            const expirationMilkDate = new Date(receivedDate);
            expirationMilkDate.setMonth(expirationMilkDate.getMonth() + 6);
            const formattedDate = expirationMilkDate.toISOString().split('T')[0];

            setValue('milkExpirationDate', formattedDate);
        } catch (e) {
            setValue('milkExpirationDate', '');
        }

        trigger(['infantDeliveryDate', 'receivedDate']);
    };

    const handleAddMilkAndClearForm = async () => {
        const values = getValues();

        try {
            await dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values))).unwrap();

            await presentAlert({
                header: 'The record has been saved',
                buttons: ['OK'],
                onDidDismiss: handleResetForm,
            });
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error?.message,
            });
        }
    };

    const handleAddMilkAndClose = async () => {
        const values = getValues();

        try {
            await dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values))).unwrap();

            await presentAlert({
                header: 'The record has been saved',
                buttons: ['OK'],
                onDidDismiss: () => {
                    handleResetForm();
                    router.push(routesMapping.home);
                },
            });
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error?.message,
            });
        }
    };

    const handleAddMilkAndAnalyse = async () => {
        const values = getValues();

        try {
            await dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values))).unwrap();

            await presentAlert({
                header: 'The record has been saved',
                buttons: ['OK'],
                onDidDismiss: () => {
                    handleResetForm();
                    router.push(`${routesMapping.analyse}?milkId=${values.milkId}`);
                },
            });
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error?.message,
            });
        }
    };

    const handleResetForm = () => reset(defaultValues);

    const today = new Date().toISOString().slice(0, 10);

    return (
        <form className={cn()}>
            <PageArea>
                <PageArea.Header
                    className={cn('header')}
                    title='Add Milk'
                    icon={<AddMilkIcon />}
                    actions={
                        <>
                            <div className={cn('actions-clear')}>
                                <IonButton id='present-alert'>Clear the form</IonButton>
                                <IonAlert
                                    header='This form will be cleared. Do you want to proceed?'
                                    trigger='present-alert'
                                    buttons={[
                                        {
                                            text: 'Yes',
                                            role: 'confirm',
                                            handler: handleResetForm,
                                        },
                                        {
                                            text: 'No',
                                            role: 'cancel',
                                        },
                                    ]}
                                ></IonAlert>
                            </div>
                        </>
                    }
                />

                <PageArea.Main className={cn('main')}>
                    <IonRow className={cn('form-container')}>
                        <div className={cn('form-group', { fluid: true })}>
                            <PreemieInput
                                type='text'
                                required
                                id='milkId'
                                labelPlacement='floating'
                                {...register('milkId')}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        Keyboard.hide();
                                    }
                                }}
                            >
                                <div slot='label'>
                                    Milk ID{' '}
                                    <IonText color='danger'>
                                        <span className={cn('asterisk')}>*</span>
                                    </IonText>
                                </div>
                            </PreemieInput>

                            <p className={cn('form-group-error')}>
                                {touchedFields.milkId && errors.milkId?.message}
                            </p>
                        </div>

                        <IonCol size='6' className={cn('form-column')}>
                            <div className={cn('form-group')}>
                                <PreemieSelect labelPlacement='floating' {...register('donorId')}>
                                    <div slot='label'>
                                        Donor ID{' '}
                                        <IonText color='danger'>
                                            <span className={cn('asterisk')}>*</span>
                                        </IonText>
                                    </div>
                                    {donorsList.map((donor: IDonor) => (
                                        <IonSelectOption key={donor.uuid} value={donor.uuid}>
                                            {donor.sensitive_data.name}{' '}
                                            {donor.sensitive_data.surname} -{' '}
                                            {donor.sensitive_data.id}
                                        </IonSelectOption>
                                    ))}
                                </PreemieSelect>

                                <p className={cn('form-group-error')}>
                                    {touchedFields.donorId && errors.donorId?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieInput
                                    type='date'
                                    max={today}
                                    required
                                    labelPlacement='floating'
                                    {...register('infantDeliveryDate', {
                                        onChange: () => {
                                            trigger(['receivedDate', 'milkExpressionDate']);
                                        },
                                    })}
                                >
                                    <div slot='label'>
                                        Infant Delivery Date{' '}
                                        <IonText color='danger'>
                                            <span className={cn('asterisk')}>*</span>
                                        </IonText>
                                    </div>
                                </PreemieInput>

                                <p className={cn('form-group-error')}>
                                    {errors.infantDeliveryDate?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieInput
                                    type='date'
                                    max={today}
                                    required
                                    labelPlacement='floating'
                                    className='received-date-size'
                                    {...register('receivedDate', {
                                        onChange: () => {
                                            trigger(['infantDeliveryDate', 'milkExpressionDate']);
                                        },
                                    })}
                                >
                                    <div slot='label'>
                                        Milk Received Date{' '}
                                        <IonText color='danger'>
                                            <span className={cn('asterisk')}>*</span>
                                        </IonText>
                                    </div>
                                </PreemieInput>

                                <p className={cn('form-group-error')}>
                                    {errors.receivedDate?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieSelect
                                    label='Storage Freezer'
                                    labelPlacement='floating'
                                    {...register('storageFreezer')}
                                >
                                    {freezersList.map((freezer: IFreezer) => (
                                        <IonSelectOption
                                            key={freezer.freezer_id}
                                            value={freezer.freezer_id}
                                        >
                                            {freezer.name}
                                        </IonSelectOption>
                                    ))}
                                </PreemieSelect>

                                <p className={cn('form-group-error')}>
                                    {touchedFields.storageFreezer && errors.storageFreezer?.message}
                                </p>
                            </div>
                        </IonCol>

                        <IonCol size='6' className={cn('form-column')}>
                            <div className={cn('form-group')}>
                                <PreemieInput
                                    type='number'
                                    labelPlacement='floating'
                                    {...register('numberOfContainers')}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            Keyboard.hide();
                                        }
                                    }}
                                >
                                    <div slot='label'>
                                        Number of Containers{' '}
                                        <IonText color='danger'>
                                            <span className={cn('asterisk')}>*</span>
                                        </IonText>
                                    </div>
                                </PreemieInput>

                                <p className={cn('form-group-error')}>
                                    {touchedFields.numberOfContainers &&
                                        errors.numberOfContainers?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieInput
                                    type='date'
                                    max={today}
                                    required={true}
                                    labelPlacement='floating'
                                    {...register('milkExpressionDate', {
                                        onChange: handleMilkExpressionDateChange,
                                    })}
                                >
                                    <div slot='label'>
                                        Milk Expression Date{' '}
                                        <IonText color='danger'>
                                            <span className={cn('asterisk')}>*</span>
                                        </IonText>
                                    </div>
                                </PreemieInput>

                                <p className={cn('form-group-error')}>
                                    {errors.milkExpressionDate?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieInput
                                    type='date'
                                    max={today}
                                    labelPlacement='floating'
                                    id='milkExpirationDate'
                                    disabled
                                    {...register('milkExpirationDate')}
                                >
                                    <div slot='label'>
                                        Milk Expiration Date{' '}
                                        <IonText color='danger'>
                                            <span className={cn('asterisk')}>*</span>
                                        </IonText>
                                    </div>
                                </PreemieInput>

                                <p className={cn('form-group-error')}>
                                    {errors.milkExpirationDate?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieSelect
                                    label='Storage Compartment'
                                    label-placement='floating'
                                    disabled={!storageFreezerValue}
                                    {...register('storageCompartment')}
                                >
                                    {compartmentList.map(compartment => (
                                        <IonSelectOption key={compartment} value={compartment}>
                                            {compartment}
                                        </IonSelectOption>
                                    ))}
                                </PreemieSelect>

                                <p className={cn('form-group-error')}>
                                    {errors.storageCompartment?.message}
                                </p>
                            </div>
                        </IonCol>
                    </IonRow>

                    <IonRow className={cn('actions')}>
                        <PreemieButton
                            className='button'
                            size='small'
                            disabled={isFetching || !isValid}
                            onClick={handleAddMilkAndClearForm}
                        >
                            {isFetching ? 'Loading...' : 'Save & Add Another Milk'}
                        </PreemieButton>

                        <PreemieButton
                            className='button'
                            size='small'
                            id='analyse-alert'
                            disabled={isFetching || !isValid}
                            onClick={handleAddMilkAndClose}
                        >
                            {isFetching ? 'Loading...' : 'Save this Milk and Close'}
                        </PreemieButton>

                        {currentDevice ? (
                            <PreemieButton
                                className='button'
                                size='small'
                                // id='analyse-alert'
                                disabled={isFetching || !isValid}
                                onClick={handleAddMilkAndAnalyse}
                            >
                                {isFetching ? 'Loading...' : 'Save this Milk & Analyse'}
                            </PreemieButton>
                        ) : null}
                    </IonRow>
                </PageArea.Main>
            </PageArea>
        </form>
    );
};
