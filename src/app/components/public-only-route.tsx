import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { userSelectors } from '@entities/user';
import { routesMapping } from '@app/routes';

import type { RouteProps } from 'react-router';

export const PublicOnlyRoute: React.FunctionComponent<RouteProps> = props => {
    const isAuthenticated = useSelector(userSelectors.isUserAuthenticated);

    if (isAuthenticated) {
        return <Redirect to={routesMapping.home} />;
    }

    return <Route {...props} />;
};
