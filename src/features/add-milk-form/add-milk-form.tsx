import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonCol, IonRow, IonSelectOption, useIonAlert, useIonRouter } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PreemieSelect, PreemieInput, CustomButton } from '@ui';
import { usePreemieToast, PageArea } from '@shared/ui';
import { classname } from '@shared/utils';
import { userSelectors } from '@entities/user';
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

const cn = classname('add-milk-form');
import './add-milk-form.css';

const defaultValues = {
    milkId: '',
    milkVolume: '',
    donorId: '',
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
    const freezersList = useSelector(selectGroupFreezers);
    const isFetching = useSelector(addMilkFormSelectors.selectIsAddMilkFormLoading);

    const [presentAlert] = useIonAlert();
    const [presentToast] = usePreemieToast();

    const {
        register,
        reset,
        watch,
        getValues,
        formState: { errors, touchedFields },
    } = useForm<AddMilkFormFieldValues>({
        defaultValues,
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const storageFreezerValue = watch('storageFreezer');

    const compartmentList = useSelector(state =>
        selectGroupCompartmentList(state, storageFreezerValue),
    );

    React.useEffect(() => {
        const fetchDonorsRequest = {
            completeData: true,
            showArchived: false,
        };

        dispatch(donorsAsyncActions.fetchDonors(fetchDonorsRequest));
        dispatch(fetchGroup({ preemie_group_id: groupId }));
    }, []);

    const handleAddMilkAndClearForm = async () => {
        const values = getValues();

        try {
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
            await dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values))).unwrap();

            await presentAlert({
                header: 'The record has been saved',
                buttons: ['OK'],
                onDidDismiss: () => {
                    reset();
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
                    reset();
                    router.push(routesMapping.analyse + `?milkId=${values.milkId}`);
                },
            });
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error?.message,
            });
        }
    };

    const hasTouchedField = Object.values(touchedFields).length > 0;
    const hasErrors = Object.values(errors).length > 0;

    const disabledSubmit = !hasTouchedField || hasErrors;

    return (
        <form className={cn()}>
            <PageArea>
                <PageArea.Header
                    className={cn('header')}
                    title='Add Milk'
                    icon={<AddMilkIcon />}
                    actions={
                        <div className={cn('form-group', { fluid: true })}>
                            <PreemieInput
                                type='text'
                                label='Milk ID'
                                label-placement='floating'
                                {...register('milkId')}
                            />

                            <p className={cn('form-group-error')}>
                                {touchedFields.milkId && errors.milkId?.message}
                            </p>
                        </div>
                    }
                />

                <PageArea.Main className={cn('main')}>
                    <IonRow className={cn('form-container')}>
                        <IonCol size='6' className={cn('form-column')}>
                            <div className={cn('form-group')}>
                                <PreemieSelect
                                    label='Donor ID'
                                    label-placement='floating'
                                    {...register('donorId')}
                                >
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
                                    label='Infant Delivery Date'
                                    label-placement='floating'
                                    {...register('infantDeliveryDate')}
                                />

                                <p className={cn('form-group-error')}>
                                    {touchedFields.infantDeliveryDate &&
                                        errors.infantDeliveryDate?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieInput
                                    type='date'
                                    label='Received Date'
                                    label-placement='floating'
                                    className='received-date-size'
                                    {...register('receivedDate')}
                                />

                                <p className={cn('form-group-error')}>
                                    {touchedFields.receivedDate && errors.receivedDate?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieSelect
                                    label='Storage Freezer'
                                    label-placement='floating'
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
                                    label='Number of Containers'
                                    label-placement='floating'
                                    {...register('numberOfContainers')}
                                />

                                <p className={cn('form-group-error')}>
                                    {touchedFields.numberOfContainers &&
                                        errors.numberOfContainers?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieInput
                                    type='date'
                                    label='Milk Expression Date'
                                    label-placement='floating'
                                    {...register('milkExpressionDate')}
                                />

                                <p className={cn('form-group-error')}>
                                    {touchedFields.milkExpressionDate &&
                                        errors.milkExpressionDate?.message}
                                </p>
                            </div>

                            <div className={cn('form-group')}>
                                <PreemieInput
                                    type='date'
                                    label='Milk Expiration Date'
                                    label-placement='floating'
                                    {...register('milkExpirationDate')}
                                />

                                <p className={cn('form-group-error')}>
                                    {touchedFields.milkExpirationDate &&
                                        errors.milkExpirationDate?.message}
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
                                    {errors.milkVolume?.message}
                                </p>
                            </div>
                        </IonCol>
                    </IonRow>

                    <IonRow className={cn('actions')}>
                        <CustomButton
                            className='button'
                            size='small'
                            disabled={isFetching || disabledSubmit}
                            onClick={handleAddMilkAndClearForm}
                        >
                            {isFetching ? 'Loading...' : 'Save & Add Another Milk'}
                        </CustomButton>

                        <CustomButton
                            className='button'
                            size='small'
                            disabled={isFetching || disabledSubmit}
                            onClick={handleAddMilkAndClose}
                        >
                            {isFetching ? 'Loading...' : 'Save this Milk and Close'}
                        </CustomButton>

                        <CustomButton
                            className='button'
                            size='small'
                            disabled={isFetching || disabledSubmit}
                            onClick={handleAddMilkAndAnalyse}
                        >
                            {isFetching ? 'Loading...' : 'Save this Milk & Analyse'}
                        </CustomButton>
                    </IonRow>
                </PageArea.Main>
            </PageArea>
        </form>
    );
};
