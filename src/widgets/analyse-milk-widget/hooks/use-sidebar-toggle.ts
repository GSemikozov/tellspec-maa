import React from 'react';
import { useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { useDispatch } from 'react-redux';

import { appActions } from '@app';

import { AnalyseWidgetTabs } from '../analyse-milk-widget.constants';

export function useSidebarToggle(activeTab, reportMilk) {
    const dispatch = useDispatch();

    useIonViewDidLeave(() => {
        dispatch(appActions.showSidebar());
    });

    useIonViewWillEnter(() => {
        if (activeTab === AnalyseWidgetTabs.TEST_RESULTS && reportMilk?.data.analyseData) {
            dispatch(appActions.hideSidebar());
        }
    }, [activeTab, reportMilk]);

    React.useEffect(() => {
        if (activeTab === AnalyseWidgetTabs.TEST_RESULTS && reportMilk?.data.analyseData) {
            dispatch(appActions.hideSidebar());
        } else {
            dispatch(dispatch(appActions.showSidebar()));
        }

        return () => {
            dispatch(appActions.showSidebar());
        };
    }, [reportMilk, activeTab]);
}
