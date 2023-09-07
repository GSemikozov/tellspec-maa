import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { userSelectors } from '@entities/user';
import * as appSelectors from '@app/model/app.selectors';

import type { RouteProps } from 'react-router';

export const ProtectedRoute: React.FunctionComponent<RouteProps> = ({ children }) => {
    const isAppFetching = useSelector(appSelectors.isAppFetching);
    const isAuthenticated = useSelector(userSelectors.isUserAuthenticated);

    if (isAppFetching) {
        return null;
    }

    if (!isAuthenticated) {
        return <Redirect to='/login' />;
    }

    return <>{children}</>;
};
