import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ProtectedRoute } from "./components/protected-route";

import { fetchAppSettings } from "./model/app.actions";

import { LoginPage } from "../pages/login";
import { HomePage } from "../pages/home";

import type { AppDispatch } from "./store";

import "./app.css";
import { AddMilkPage } from "../pages/add-milk";

setupIonicReact();

export const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAppSettings());
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            <LoginPage />
          </Route>

          <ProtectedRoute exact path="/">
            <HomePage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/add-milk">
            <AddMilkPage />
          </ProtectedRoute>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};
