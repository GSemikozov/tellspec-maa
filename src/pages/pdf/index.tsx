import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Printer } from '@ionic-native/printer';
import { useHistory } from 'react-router';

import { appActions } from '@app';
import { fetchMilksByIds, selectIsMilkLoading, selectMilkByIds } from '@entities/milk';
import { PDFTemplate } from '@entities/reports/components/pdf-template';
import { selectLayoutClassName } from '@app/model';
import { LogoAnimation } from '@ui/logo/animated-logo';

import type { RouteComponentProps } from 'react-router';
import type { AppDispatch } from '@app';
import type { Report } from '@entities/reports';
import type { Milk } from '@entities/milk';

import './index.css';

interface PDFPageProps extends RouteComponentProps<{ ids: string }> {}

export const PDFPage: React.FC<PDFPageProps> = ({ match }) => {
    const ids = decodeURIComponent(match.params.ids)?.split(',') || [];
    const dispatch = useDispatch<AppDispatch>();
    const history = useHistory();

    const milks = useSelector(state => selectMilkByIds(state, ids));
    const isLoading = useSelector(selectIsMilkLoading);
    const isPending = useRef(false);
    const layoutClassName = useSelector(selectLayoutClassName);

    const classNames = useRef<Record<string, string>>({});

    useEffect(() => {
        if (ids.length > 0) {
            dispatch(fetchMilksByIds(ids));
        }
    }, []);

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

    if (isLoading || isPending.current) {
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
            {milks.map((milk: Milk) => (
                <PDFTemplate key={milk.milk_id} report={milk.reports[0] as Report} />
            ))}
        </>
    );
};
