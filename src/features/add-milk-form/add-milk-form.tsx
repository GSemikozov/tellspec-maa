import * as React from 'react';
import { IonButton, IonInput, IonSelect, IonSelectOption, useIonAlert } from '@ionic/react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { BarcodeScanner } from '@ui';
import { getCompartmentList } from '@entities/groups/model/groups.selectors';
import { userSelectors } from '@entities/user';
import { donorsAsyncActions, donorsSelectors } from '@entities/donors';
import { groupsAsyncActions, groupsSelectors } from '@entities/groups';
import { IFreezer } from '@entities/groups/model/groups.types';
import { AppDispatch } from '@app/store';

import { addMilkFormSelectors, addMilkFormAsyncActions } from './model';
import { buildMilkData } from './add-milk-form.utils';

import type { IDonor } from '@entities/donors/model/donors.types';

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
    const groupId = useSelector(userSelectors.getGroupId);
    const donorsList = useSelector(donorsSelectors.getAllDonors);
    // const groupsList = useSelector(groupsSelectors.getGroup);
    const freezersList = useSelector(groupsSelectors.getFreezers);
    const isFetching: boolean | undefined = useSelector(addMilkFormSelectors.isMilkFormFetching);
    const [presentAlert] = useIonAlert();
    const {
        register,
        getValues,
        reset,
        control,
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
        dispatch(
            donorsAsyncActions.fetchDonors({
                completeData: true,
                showArchived: false,
            }),
        );
        dispatch(groupsAsyncActions.fetchGroup({ preemie_group_id: groupId }));
    }, []);

    const handleAddMilkAndClearForm = async () => {
        const values = getValues();

        dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values)));
        await presentAlert({
            header: 'The record has been saved',
            buttons: ['OK'],
            onDidDismiss: () => reset(),
        });
    };

    const handleAddMilkAndClose = async () => {
        const values = getValues();

        dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values)));
        await presentAlert({
            header: 'The record has been saved',
            buttons: ['OK'],
            onDidDismiss: () => (window.location.href = '/'),
        });
    };

    const handleAddMilkAndAnalyse = async () => {
        const values = getValues();

        dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values)));
        await presentAlert({
            header: 'The record has been saved',
            buttons: ['OK'],
            onDidDismiss: () => (window.location.href = '/analyse'),
        });
    };

    return (
        <form>
            <div className='ion-margin-top ion-margin-bottom'>
                <Controller
                    defaultValue=''
                    control={control}
                    name='milkId'
                    render={({ field }) => {
                        return (
                            <BarcodeScanner
                                {...field}
                                title='Milk ID'
                                onChange={e => field.onChange(e)}
                                value={field.value}
                            />
                        );
                    }}
                />
                <span style={{ color: 'red' }}>{errors.milkVolume?.message}</span>
            </div>

            <div className='ion-margin-top ion-margin-bottom'>
                <IonSelect
                    label='Donor ID'
                    label-placement='floating'
                    fill='outline'
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

            <div className='ion-margin-top ion-margin-bottom'>
                <IonSelect
                    label='Storage Compartment'
                    label-placement='floating'
                    fill='outline'
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

            <div className='ion-margin-top ion-margin-bottom'>
                <IonInput
                    type='number'
                    label='Number of Containers'
                    label-placement='floating'
                    fill='outline'
                    {...register('numberOfContainers', {
                        required: 'This is a required field',
                    })}
                />
                <span style={{ color: 'red' }}>{errors.numberOfContainers?.message}</span>
            </div>

            <div className='ion-margin-top ion-margin-bottom'>
                <IonInput
                    type='date'
                    label='Infant Delivery Date'
                    label-placement='floating'
                    fill='outline'
                    {...register('infantDeliveryDate', {
                        required: 'This is a required field',
                    })}
                />
                <span style={{ color: 'red' }}>{errors.infantDeliveryDate?.message}</span>
            </div>

            <div className='ion-margin-top ion-margin-bottom'>
                <IonInput
                    type='date'
                    label='Milk Expression Date'
                    label-placement='floating'
                    fill='outline'
                    {...register('milkExpressionDate', {
                        required: 'This is a required field',
                    })}
                />
                <span style={{ color: 'red' }}>{errors.milkExpressionDate?.message}</span>
            </div>

            <div className='ion-margin-top ion-margin-bottom'>
                <IonInput
                    type='date'
                    label='Milk Expiration Date'
                    label-placement='floating'
                    fill='outline'
                    {...register('milkExpirationDate', {
                        required: 'This is a required field',
                    })}
                />
                <span style={{ color: 'red' }}>{errors.milkExpirationDate?.message}</span>
            </div>

            <div className='ion-margin-top ion-margin-bottom'>
                <IonInput
                    type='date'
                    label='Received Date'
                    label-placement='floating'
                    fill='outline'
                    {...register('receivedDate', {
                        required: 'This is a required field',
                    })}
                />
                <span style={{ color: 'red' }}>{errors.receivedDate?.message}</span>
            </div>

            <div className='ion-margin-top ion-margin-bottom'>
                <IonSelect
                    label='Storage Freezer'
                    label-placement='floating'
                    fill='outline'
                    {...register('storageFreezer', {
                        required: 'This is a required field',
                    })}
                >
                    {freezersList.map((freezer: IFreezer) => (
                        <IonSelectOption key={freezer.freezer_id} value={freezer.freezer_id}>
                            {freezer.name}
                        </IonSelectOption>
                    ))}
                </IonSelect>
                <span style={{ color: 'red' }}>{errors.storageFreezer?.message}</span>
            </div>

            <div className='ion-margin-top ion-margin-bottom'>
                <IonInput
                    type='text'
                    label='Storage Compartment'
                    label-placement='floating'
                    fill='outline'
                    {...register('storageCompartment', {
                        required: 'This is a required field',
                    })}
                />
                <span style={{ color: 'red' }}>{errors.storageCompartment?.message}</span>
            </div>

            <IonButton size='large' disabled={isFetching} onClick={handleAddMilkAndClearForm}>
                {isFetching ? 'loading...' : 'Save & Add Another Milk'}
            </IonButton>

            <IonButton size='large' disabled={isFetching} onClick={handleAddMilkAndClose}>
                {isFetching ? 'loading...' : 'Save this Milk and Close'}
            </IonButton>

            <IonButton size='large' disabled={isFetching} onClick={handleAddMilkAndAnalyse}>
                {isFetching ? 'loading...' : 'Save this Milk & Analyse'}
            </IonButton>
        </form>
    );
};
