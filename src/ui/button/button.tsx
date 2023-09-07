import { IonButton } from "@ionic/react";
import "./button.css";

export const CustomButton = (props: any) => {
  return <IonButton {...props} className="custom-button" />;
};
