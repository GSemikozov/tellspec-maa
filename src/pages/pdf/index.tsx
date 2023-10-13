import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Printer } from '@ionic-native/printer';
import { useHistory } from 'react-router';
import { useIonRouter } from '@ionic/react';

import { appActions } from '@app';
import { routesMapping } from '@app/routes';
import { userSelectors } from '@entities/user';
import { fetchMilksByIds, selectIsMilkLoading, selectMilkByIds } from '@entities/milk';
import { fetchGroup, selectGroupFreezers, selectIsGroupLoading } from '@entities/groups';
import { PDFTemplate } from '@entities/reports/components/pdf-template';
import { donorsAsyncActions, donorsSelectors } from '@entities/donors';
import { selectLayoutClassName } from '@app/model';
import { LogoAnimation } from '@ui/logo/animated-logo';

import type { RouteComponentProps } from 'react-router';
import type { AppDispatch } from '@app';
import type { Milk } from '@entities/milk';

import './index.css';

interface PDFPageProps extends RouteComponentProps<{ ids: string }> {}

export const PDFPage: React.FC<PDFPageProps> = ({ match }) => {
    const ids = decodeURIComponent(match.params.ids);
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();
    const ionRouter = useIonRouter();

    const user = useSelector(userSelectors.getUser);
    const milks = useSelector(state => selectMilkByIds(state, ids));
    const donorsList = useSelector(donorsSelectors.getAllDonors);
    const freezersList = useSelector(selectGroupFreezers);

    const isMilkLoading = useSelector(selectIsMilkLoading);
    const areDonorsFetching = useSelector(donorsSelectors.isDonorsFetching);
    const areFreezersFetching = useSelector(selectIsGroupLoading);

    const layoutClassName = useSelector(selectLayoutClassName);

    const isPending = useRef(false);
    const classNames = useRef<Record<string, string>>({});

    const isLoading =
        isMilkLoading || areDonorsFetching || areFreezersFetching || isPending.current;

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

        const rootElement = document.querySelector('#root');
        const pageElement = document.querySelector('.ion-page');

        classNames.current.body = document.body.className;
        classNames.current.layout = layoutClassName!;
        document.body.className = 'scrollable';

        if (rootElement) {
            rootElement.className = 'scrollable';
            classNames.current.root = rootElement.className;
        }

        if (pageElement) {
            pageElement.className = 'scrollable';
            classNames.current.page = pageElement.className;
        }

        dispatch(appActions.setLayoutClassName('scrollable'));

        const print = async () => {
            isPending.current = false;
            return Printer.print(undefined, { margin: false, autoFit: false })
                .then(() => {
                    dispatch(appActions.setLayoutClassName(classNames.current.layout));
                    document.body.className = classNames.current.body;

                    if (rootElement) {
                        rootElement.className = classNames.current.root;
                    }

                    if (pageElement) {
                        pageElement.className = classNames.current.page;
                    }

                    history.goBack();
                })
                .catch(e => {
                    console.log(e);
                    isPending.current = true;
                    setTimeout(print, 3000);
                });
        };

        print();
    }, [milks]);

    useEffect(() => {
        return () => {
            ionRouter.push(routesMapping.reports);
        };
    }, []);

    if (isLoading) {
        return (
            <div className='pdf__preloader'>
                <LogoAnimation />
                {isPending && <div className='pdf__preloader-message'>Wait...</div>}
            </div>
        );
    }

    if (milks.length === 0) {
        return <div>Milk not found</div>;
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
                    <PDFTemplate key={milk.milk_id} milk={milk} donor={donor} freezer={freezer} />
                );
            })}
        </>
    );
};
