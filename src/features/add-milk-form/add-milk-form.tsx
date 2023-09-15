import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    IonCol,
    IonGrid,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonText,
    useIonAlert,
    useIonRouter,
} from '@ionic/react';
import { useForm } from 'react-hook-form';

import { usePreemieToast } from '@shared/ui';
import { classname } from '@shared/utils';
import { userSelectors } from '@entities/user';
import { donorsAsyncActions, donorsSelectors } from '@entities/donors';
import { groupsAsyncActions, groupsSelectors } from '@entities/groups';
import { getCompartmentList } from '@entities/groups/model/groups.selectors';
import { CustomInput } from '@ui/input';
import { CustomButton } from '@ui/button';
import { routesMapping } from '@app/routes';
import { AppDispatch } from '@app/store';
import { IFreezer } from '@entities/groups/model/groups.types';

import AddMilkIcon from '../../../assets/images/add-milk-selected.png';

import { addMilkFormSelectors, addMilkFormAsyncActions } from './model';
import { buildMilkData } from './add-milk-form.utils';

import type { IDonor } from '@entities/donors/model/donors.types';

import './add-milk-form.css';

const cn = classname('add-milk-form');

export type AddMilkFormFieldValues = {
    milkId: string;
    donorId: string;
    milkVolume: string;
    numberOfContainers: number;
    infantDeliveryDate: string;
    milkExpressionDate: string;
    milkExpirationDate: string;
    receivedDate: string;
    storageFreezer: string;
    storageCompartment: string;
};

const defaultValues = {
    milkId: '',
    donorId: '',
    milkVolume: '',
    numberOfContainers: 1,
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

    const groupId = useSelector(userSelectors.selectGroupId);
    const donorsList = useSelector(donorsSelectors.getAllDonors);
    const freezersList = useSelector(groupsSelectors.getFreezers);
    const isFetching = useSelector(addMilkFormSelectors.selectIsAddMilkFormLoading);

    const [presentAlert] = useIonAlert();
    const [presentToast] = usePreemieToast();

    const {
        register,
        getValues,
        reset,
        formState: { errors },
        watch,
    } = useForm<AddMilkFormFieldValues>({
        defaultValues,
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const selectedStorageFreezer = watch('storageFreezer');
    const compartmentList = useSelector(getCompartmentList(selectedStorageFreezer));

    React.useEffect(() => {
        const fetchDonorsRequest = {
            completeData: true,
            showArchived: false,
        };

        dispatch(donorsAsyncActions.fetchDonors(fetchDonorsRequest));
        dispatch(groupsAsyncActions.fetchGroup({ preemie_group_id: groupId }));
    }, []);

    const handleAddMilkAndClearForm = async () => {
        const values = getValues();

        try {
            if (values.infantDeliveryDate > values.milkExpressionDate) {
                throw new Error("Infant delivery date can't be after milk expression date");
            }

            await dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values))).unwrap();

            await presentAlert({
                header: 'The record has been saved',
                buttons: ['OK'],
                onDidDismiss: () => reset(),
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
            if (values.infantDeliveryDate > values.milkExpressionDate) {
                throw new Error("Infant delivery date can't be after milk expression date");
            }

            await dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values))).unwrap();

            await presentAlert({
                header: 'The record has been saved',
                buttons: ['OK'],
                onDidDismiss: () => router.push(routesMapping.home),
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
            if (values.infantDeliveryDate > values.milkExpressionDate) {
                throw new Error("Infant delivery date can't be after milk expression date");
            }

            await dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values))).unwrap();

            await presentAlert({
                header: 'The record has been saved',
                buttons: ['OK'],
                onDidDismiss: () => router.push(routesMapping.analyse + `?milkId=${values.milkId}`),
            });
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error?.message,
            });
        }
    };

    const currentValues = getValues();

    return (
        <form>
            <IonGrid id='add-milk-wrapper'>
                <div className={cn('header')}>
                    <h2>
                        <IonText>
                            <img src={AddMilkIcon} />
                            Add Milk
                        </IonText>
                    </h2>

                    <div className={cn('form-group', { fluid: true })}>
                        <CustomInput
                            type='text'
                            label='Milk ID'
                            label-placement='floating'
                            {...register('milkId', {
                                required: 'This is a required field',
                            })}
                        />

                        <p className={cn('form-group-error')}>{errors.milkVolume?.message}</p>
                    </div>
                </div>

                <IonRow>
                    <IonCol size='6' className={cn('form-column')}>
                        <div className={cn('form-group')}>
                            <IonSelect
                                className='add-milk-input'
                                label='Donor ID'
                                label-placement='floating'
                                {...register('donorId', {
                                    required: 'This is a required field',
                                })}
                            >
                                {donorsList.map((donor: IDonor) => (
                                    <IonSelectOption key={donor.uuid} value={donor.uuid}>
                                        {donor.sensitive_data.name} {donor.sensitive_data.surname} -{' '}
                                        {donor.sensitive_data.id}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>

                            <p className={cn('form-group-error')}>{errors.donorId?.message}</p>
                        </div>

                        <div className={cn('form-group')}>
                            <CustomInput
                                type='date'
                                label='Milk Expression Date'
                                label-placement='floating'
                                {...register('milkExpressionDate', {
                                    required: 'This is a required field',
                                })}
                            />

                            <p className={cn('form-group-error')}>
                                {errors.milkExpressionDate?.message}
                            </p>
                        </div>

                        <div className={cn('form-group')}>
                            <CustomInput
                                type='date'
                                label='Received Date'
                                label-placement='floating'
                                className='received-date-size'
                                {...register('receivedDate', {
                                    required: 'This is a required field',
                                })}
                            />

                            <p className={cn('form-group-error')}>{errors.receivedDate?.message}</p>
                        </div>

                        <div className={cn('form-group')}>
                            <IonSelect
                                className='add-milk-input'
                                label='Storage Freezer'
                                label-placement='floating'
                                {...register('storageFreezer', {
                                    required: 'This is a required field',
                                })}
                            >
                                {freezersList.map((freezer: IFreezer) => (
                                    <IonSelectOption
                                        key={freezer.freezer_id}
                                        value={freezer.freezer_id}
                                    >
                                        {freezer.name}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>

                            <p className={cn('form-group-error')}>
                                {errors.storageFreezer?.message}
                            </p>
                        </div>
                    </IonCol>

                    <IonCol size='6' className={cn('form-column')}>
                        <div className={cn('form-group')}>
                            <CustomInput
                                type='number'
                                label='Number of Containers'
                                label-placement='floating'
                                {...register('numberOfContainers', {
                                    required: 'This is a required field',
                                })}
                            />

                            <p className={cn('form-group-error')}>
                                {errors.numberOfContainers?.message}
                            </p>
                        </div>

                        <div className={cn('form-group')}>
                            <CustomInput
                                type='date'
                                label='Milk Expiration Date'
                                label-placement='floating'
                                {...register('milkExpirationDate', {
                                    required: 'This is a required field',
                                })}
                            />

                            <p className={cn('form-group-error')}>
                                {errors.milkExpirationDate?.message}
                            </p>
                        </div>

                        <div className={cn('form-group')}>
                            <CustomInput
                                type='date'
                                label='Infant Delivery Date'
                                label-placement='floating'
                                {...register('infantDeliveryDate', {
                                    required: 'This is a required field',
                                })}
                            />

                            <p className={cn('form-group-error')}>
                                {errors.infantDeliveryDate?.message}
                            </p>
                        </div>

                        <div className={cn('form-group')}>
                            <IonSelect
                                className='add-milk-input'
                                label='Storage Compartment'
                                label-placement='floating'
                                disabled={!currentValues.storageFreezer}
                                {...register('storageCompartment', {
                                    required: 'This is a required field',
                                })}
                            >
                                {compartmentList.map(compartment => (
                                    <IonSelectOption key={compartment} value={compartment}>
                                        {compartment}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>

                            <p className={cn('form-group-error')}>{errors.milkVolume?.message}</p>
                        </div>
                    </IonCol>
                </IonRow>

                <IonRow className={cn('actions')}>
                    <CustomButton
                        className='button'
                        size='small'
                        disabled={isFetching}
                        onClick={handleAddMilkAndClearForm}
                    >
                        {isFetching ? 'Loading...' : 'Save & Add Another Milk'}
                    </CustomButton>

                    <CustomButton
                        className='button'
                        size='small'
                        disabled={isFetching}
                        onClick={handleAddMilkAndClose}
                    >
                        {isFetching ? 'Loading...' : 'Save this Milk and Close'}
                    </CustomButton>

                    <CustomButton
                        className='button'
                        size='small'
                        disabled={isFetching}
                        onClick={handleAddMilkAndAnalyse}
                    >
                        {isFetching ? 'Loading...' : 'Save this Milk & Analyse'}
                    </CustomButton>
                </IonRow>
            </IonGrid>
        </form>
    );
};
