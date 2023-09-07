import { ChangeEvent, forwardRef } from "react";
import { IonInput } from "@ionic/react";
import { TextFieldTypes } from "@ionic/core";
import "./input.css";

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: TextFieldTypes | undefined;
  fill?: "outline" | "solid";
 value?: string

}

export const CustomInput = forwardRef<HTMLIonInputElement, InputProps>(
  (props, ref) => {
    const { label, placeholder, type, fill, value} = props;
    return (
      <IonInput
        {...props}
        ref={ref}
        label={label}
        placeholder={placeholder}
        fill={fill}
        type={type}
        value={value}
        className="custom-input"
      />
    );
  }
);
