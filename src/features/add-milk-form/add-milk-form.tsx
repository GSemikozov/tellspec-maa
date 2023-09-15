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
} from '@ionic/react';
import { useForm } from 'react-hook-form';

import { usePreemieToast } from '@shared/ui';
import { userSelectors } from '@entities/user';
import { donorsAsyncActions, donorsSelectors } from '@entities/donors';
import { groupsAsyncActions, groupsSelectors } from '@entities/groups';
import { getCompartmentList } from '@entities/groups/model/groups.selectors';
import { CustomInput } from '@ui/input';
import { CustomButton } from '@ui/button';
import { AddMilkIcon } from '@ui/icons';
import { AppDispatch } from '@app/store';
import { IFreezer } from '@entities/groups/model/groups.types';
import { classname } from '@shared/utils';

// import AddMilkIcon from '../../../assets/images/add-milk-selected.png';

import { addMilkFormSelectors, addMilkFormAsyncActions } from './model';
import { buildMilkData } from './add-milk-form.utils';

import type { IDonor } from '@entities/donors/model/donors.types';

import './add-milk-form.css';
const cn = classname('add-milk-form');

export interface AddMilkFormFieldValues {
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
}

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

        if (values.infantDeliveryDate > values.milkExpressionDate) {
            await presentToast({
                type: 'error',
                message: "Infant delivery date can't be after milk expression date",
            });

            return;
        }

        dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values)));

        await presentAlert({
            header: 'The record has been saved',
            buttons: ['OK'],
            onDidDismiss: () => reset(),
        });
    };

    const handleAddMilkAndClose = async () => {
        const values = getValues();

        if (values.infantDeliveryDate > values.milkExpressionDate) {
            await presentToast({
                type: 'error',
                message: "Infant delivery date can't be after milk expression date",
            });

            return;
        }

        dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values)));

        await presentAlert({
            header: 'The record has been saved',
            buttons: ['OK'],
            // onDidDismiss: () => (window.location.href = '/'),
        });
    };

    const handleAddMilkAndAnalyse = async () => {
        const values = getValues();

        if (values.infantDeliveryDate > values.milkExpressionDate) {
            await presentToast({
                type: 'error',
                message: "Infant delivery date can't be after milk expression date",
            });

            return;
        }

        dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values)));

        await presentAlert({
            header: 'The record has been saved',
            buttons: ['OK'],
            // onDidDismiss: () => (window.location.href = '/analyse'),
        });
    };

    return (
        <form>
            <IonGrid className={cn()}>
                <div className={cn('header')}>
                    <div className={cn('header-title-icon-wrapper')}>
                        <div className={cn('header-title-icon')}>
                            <AddMilkIcon size={32} color='currentColor' />
                        </div>
                        <div className={cn('header-title-text')}>Add Milk</div>
                    </div>
                    <div className={cn('milk-id-input')}>
                        <CustomInput
                            type='text'
                            label='Milk ID'
                            label-placement='floating'
                            {...register('milkId', {
                                required: 'This is a required field',
                            })}
                        />

                        <span style={{ color: 'red' }}>{errors.milkVolume?.message}</span>
                    </div>
                </div>

                <IonRow>
                    <IonCol size='6'>
                        <div className={cn('input-wrapper')}>
                            <IonSelect
                                className={cn('input')}
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
                            <span style={{ color: 'red' }}>{errors.donorId?.message}</span>
                        </div>

                        <div className={cn('input-wrapper')}>
                            <IonSelect
                                label='Storage Compartment'
                                label-placement='floating'
                                className={cn('input')}
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
                            <span style={{ color: 'red' }}>{errors.milkVolume?.message}</span>
                        </div>

                        <div className={cn('input-wrapper')}>
                            <CustomInput
                                type='number'
                                label='Number of Containers'
                                label-placement='floating'
                                {...register('numberOfContainers', {
                                    required: 'This is a required field',
                                })}
                            />
                            <span style={{ color: 'red' }}>
                                {errors.numberOfContainers?.message}
                            </span>
                        </div>
                        <div className={cn('input-wrapper')}>
                            <CustomInput
                                type='date'
                                label='Milk Expression Date'
                                label-placement='floating'
                                // className='expression-date-size'
                                {...register('milkExpressionDate', {
                                    required: 'This is a required field',
                                })}
                            />

                            <span style={{ color: 'red' }}>
                                {errors.milkExpressionDate?.message}
                            </span>
                        </div>
                    </IonCol>
                    <IonCol size='6'>
                        <div className={cn('input-wrapper')}>
                            <CustomInput
                                type='date'
                                label='Infant Delivery Date'
                                label-placement='floating'
                                className='infant-delivery-size'
                                {...register('infantDeliveryDate', {
                                    required: 'This is a required field',
                                })}
                            />
                            <span style={{ color: 'red' }}>
                                {errors.infantDeliveryDate?.message}
                            </span>
                        </div>

                        <div className={cn('input-wrapper')}>
                            <CustomInput
                                type='date'
                                label='Milk Expiration Date'
                                label-placement='floating'
                                {...register('milkExpirationDate', {
                                    required: 'This is a required field',
                                })}
                            />
                            <span style={{ color: 'red' }}>
                                {errors.milkExpirationDate?.message}
                            </span>
                        </div>

                        <div className={cn('input-wrapper')}>
                            <CustomInput
                                type='date'
                                label='Received Date'
                                label-placement='floating'
                                className='received-date-size'
                                {...register('receivedDate', {
                                    required: 'This is a required field',
                                })}
                            />
                            <span style={{ color: 'red' }}>{errors.receivedDate?.message}</span>
                        </div>

                        <div className={cn('input-wrapper')}>
                            <IonSelect
                                className={cn('input')}
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
                            <span style={{ color: 'red' }}>{errors.storageFreezer?.message}</span>
                        </div>
                    </IonCol>
                </IonRow>

                <IonRow>
                    <div className={cn('button-wrapper')}>
                        <CustomButton
                            size='small'
                            disabled={isFetching}
                            onClick={handleAddMilkAndClearForm}
                        >
                            {isFetching ? 'loading...' : 'Save & Add Another Milk'}
                        </CustomButton>

                        <CustomButton
                            size='small'
                            disabled={isFetching}
                            onClick={handleAddMilkAndClose}
                        >
                            {isFetching ? 'loading...' : 'Save this Milk and Close'}
                        </CustomButton>

                        <CustomButton
                            size='small'
                            disabled={isFetching}
                            onClick={handleAddMilkAndAnalyse}
                        >
                            {isFetching ? 'loading...' : 'Save this Milk & Analyse'}
                        </CustomButton>
                    </div>
                </IonRow>
            </IonGrid>
        </form>
    );
};
