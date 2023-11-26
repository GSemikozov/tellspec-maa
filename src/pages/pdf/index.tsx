import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Printer } from '@ionic-native/printer';
import { IonFabButton, IonIcon, useIonRouter } from '@ionic/react';
import { print as printIcon, arrowBack as arrowBackIcon } from 'ionicons/icons';

import { userSelectors } from '@entities/user';
import { fetchMilksByIds, selectIsMilkLoading, selectMilkByIds } from '@entities/milk';
import { fetchGroup, selectGroupFreezers, selectIsGroupLoading } from '@entities/groups';
import { PDFTemplate } from '@entities/reports/components/pdf-template';
import { donorsAsyncActions, donorsSelectors } from '@entities/donors';
import { LogoAnimation } from '@ui/logo/animated-logo';

import type { RouteComponentProps } from 'react-router';
import type { AppDispatch } from '@app';
import type { Milk } from '@entities/milk';

import './index.css';

interface PDFPageProps extends RouteComponentProps<{ ids: string }> {}

export const PDFPage: React.FC<PDFPageProps> = ({ match }) => {
    const ids = decodeURIComponent(match.params.ids);
    const dispatch = useDispatch<AppDispatch>();

    const router = useIonRouter();

    const user = useSelector(userSelectors.getUser);
    const milks = useSelector(state => selectMilkByIds(state, ids));
    const donorsList = useSelector(donorsSelectors.getAllDonors);
    const freezersList = useSelector(selectGroupFreezers);

    const isMilkLoading = useSelector(selectIsMilkLoading);
    const areDonorsFetching = useSelector(donorsSelectors.isDonorsFetching);
    const areFreezersFetching = useSelector(selectIsGroupLoading);

    const isLoading = isMilkLoading || areDonorsFetching || areFreezersFetching;

    const date = new Date();
    const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    const filename =
        milks.length === 1
            ? `Milk ${milks[0].milk_id} report on ${formattedDate}`
            : `Milk reports on ${formattedDate}`;

    const handleBackClick = () => router.goBack();

    const print = () =>
        Printer.print(undefined, { margin: false, autoFit: false, name: filename }).catch(e => {
            console.log(e);
            setTimeout(print, 3000);
        });

    React.useEffect(() => {
        if (ids.length > 0) {
            const fetchDonorsRequest = {
                completeData: true,
                showArchived: false,
            };

            const fetchGroupRequest = {
                preemie_group_id: user.metadata.group_id,
                show_archived: false,
            };

            dispatch(fetchMilksByIds(ids));
            dispatch(fetchGroup(fetchGroupRequest));
            dispatch(donorsAsyncActions.fetchDonors(fetchDonorsRequest));
        }
    }, [ids]);

    React.useEffect(() => {
        if (milks.length === 0) {
            return;
        }

        const bodyElement = document.body;
        const rootElement = document.querySelector('#root');
        const pageElement = document.querySelector('.ion-page');
        const outletElement = document.querySelector('ion-router-outlet');

        if (bodyElement) {
            document.body.className = 'scrollable';
        }

        if (rootElement) {
            rootElement.className = 'scrollable';
        }

        if (pageElement) {
            pageElement.className = 'scrollable';
        }

        if (outletElement) {
            outletElement.className = 'scrollable';
        }
    }, [milks]);

    if (isLoading) {
        return (
            <div className='pdf__preloader'>
                <LogoAnimation />
                <div className='pdf__preloader-message'>Wait...</div>
            </div>
        );
    }

    return (
        <>
            {milks.map((milk: Milk) => {
                const sensitiveData = milk.sensitive_data;
                const donor = donorsList.find(donor => donor.uuid === sensitiveData.sourceId);
                const freezer = freezersList.find(
                    freezer => freezer.freezer_id === sensitiveData.storageFreezer,
                );

                return (
                    <div key={milk.milk_id}>
                        <PDFTemplate milk={milk} donor={donor} freezer={freezer} />

                        <div className='pdf__buttons-panel'>
                            <IonFabButton className='pdf__button' onClick={print}>
                                <IonIcon icon={printIcon}></IonIcon>
                            </IonFabButton>

                            <IonFabButton className='pdf__button' onClick={handleBackClick}>
                                <IonIcon icon={arrowBackIcon}></IonIcon>
                            </IonFabButton>
                        </div>
                    </div>
                );
            })}
        </>
    );
};
