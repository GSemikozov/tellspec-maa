import React from "react";
import {IonCol, IonRow, IonSpinner} from "@ionic/react"

interface PreloaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export const Preloader: React.FC<PreloaderProps> = (props) => {
  const { isLoading, children } = props;

  return (
    <IonRow className="ion-text-center">
      <IonCol>
        {
          isLoading
            ? <IonSpinner name="circular" />
            : children
        }
      </IonCol>
    </IonRow>
  )
}
