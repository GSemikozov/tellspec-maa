import { forwardRef } from "react";
import { IonInput } from "@ionic/react";
import { TextFieldTypes } from "@ionic/core";
import "./input.css";

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: TextFieldTypes | undefined;
  fill?: "outline" | "solid";
  //   innerRef?: React.Ref<HTMLInputElement> | undefined;
}

export const CustomInput = forwardRef<HTMLIonInputElement, InputProps>(
  (props, ref) => {
    const { label, placeholder, type, fill } = props;
    return (
      <IonInput
        {...props}
        ref={ref}
        label={label}
        placeholder={placeholder}
        fill={fill}
        type={type}
        className="custom-input"
      />
    );
  }
);
