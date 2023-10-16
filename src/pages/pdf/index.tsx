import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Printer } from '@ionic-native/printer';
import { useHistory } from 'react-router';
import { userSelectors } from '@entities/user';
import { fetchMilksByIds, selectIsMilkLoading, selectMilkByIds } from '@entities/milk';
import { fetchGroup, selectGroupFreezers, selectIsGroupLoading } from '@entities/groups';
import { PDFTemplate } from '@entities/reports/components/pdf-template';
import { donorsAsyncActions, donorsSelectors } from '@entities/donors';
import { LogoAnimation } from '@ui/logo/animated-logo';
import { IonFabButton, IonIcon } from '@ionic/react';
import { print as printIcon, arrowBack as arrowBackIcon } from 'ionicons/icons';

import type { RouteComponentProps } from 'react-router';
import type { AppDispatch } from '@app';
import type { Milk } from '@entities/milk';

import './index.css';

interface PDFPageProps extends RouteComponentProps<{ ids: string }> {}

export const PDFPage: React.FC<PDFPageProps> = ({ match }) => {
    const ids = decodeURIComponent(match.params.ids);
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();

    const user = useSelector(userSelectors.getUser);
    const milks = useSelector(state => selectMilkByIds(state, ids));
    const donorsList = useSelector(donorsSelectors.getAllDonors);
    const freezersList = useSelector(selectGroupFreezers);

    const isMilkLoading = useSelector(selectIsMilkLoading);
    const areDonorsFetching = useSelector(donorsSelectors.isDonorsFetching);
    const areFreezersFetching = useSelector(selectIsGroupLoading);

    const isLoading = isMilkLoading || areDonorsFetching || areFreezersFetching;

    const date = new Date().toLocaleString().replace(/[ ,]/gm, '_');
    const filename = milks.length === 1 ? `report_${milks[0].milk_id}_${date}` : `reports_${date}`;

    const handleBackClick = () => history.goBack();

    const print = () =>
        Printer.print(undefined, { margin: false, autoFit: false, name: filename }).catch(e => {
            console.log(e);
            setTimeout(print, 3000);
        });

    useEffect(() => {
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

    useEffect(() => {
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
                    <>
                        <PDFTemplate
                            key={milk.milk_id}
                            milk={milk}
                            donor={donor}
                            freezer={freezer}
                        />

                        <div className='pdf__buttons-panel'>
                            <IonFabButton className='pdf__button' onClick={print}>
                                <IonIcon icon={printIcon}></IonIcon>
                            </IonFabButton>

                            <IonFabButton className='pdf__button' onClick={handleBackClick}>
                                <IonIcon icon={arrowBackIcon}></IonIcon>
                            </IonFabButton>
                        </div>
                    </>
                );
            })}
        </>
    );
};
