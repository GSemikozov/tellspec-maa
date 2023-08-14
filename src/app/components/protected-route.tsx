import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { userSelectors } from "../../entities/user";

import type { RouteProps } from "react-router";
import * as appSelectors from "../model/app.selectors";

export const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const isAppFetching = useSelector(appSelectors.isAppFetching);
  const isAuthenticated = useSelector(userSelectors.isUserAuthenticated);

  if (isAppFetching) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect to='/login' />
  }

  return (
    <>{children}</>
  )
};
