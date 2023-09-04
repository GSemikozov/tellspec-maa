import React, { forwardRef } from "react";
import { IonInput } from "@ionic/react";
import { TextFieldTypes } from "@ionic/core";
import "./input.css";

interface CustomProps {
  label?: string;
  placeholder?: string;
  type?: TextFieldTypes | undefined;
  fill?: "outline" | "solid";
//   innerRef?: React.Ref<HTMLInputElement> | undefined;
}

const CustomInput: React.ForwardRefRenderFunction<
  HTMLIonInputElement,
  CustomProps
> = ({ label, placeholder, type, fill, ...props }, ref) => {
  return (
    <IonInput
      {...props}
      ref={ref as React.Ref<HTMLIonInputElement>}
      label={label}
      placeholder={placeholder}
      fill={fill}
      type={type}
      className="custom-input"
    />
  );
};

export default forwardRef(CustomInput);
