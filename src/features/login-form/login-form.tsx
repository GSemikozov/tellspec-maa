import React from "react";
import { IonButton, IonInput, IonItem, IonList } from "@ionic/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { userAsyncActions, userSelectors } from "../../entities/user";

import type { AppDispatch } from "../../app/store";

interface FieldValues {
  email: string;
  password: string;
}

const defaultValues = {
  email: "",
  password: "",
};

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isFetching = useSelector(userSelectors.isUserFetching);
  const { register, formState, handleSubmit } = useForm<FieldValues>({
    defaultValues,
    mode: "onSubmit",
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    dispatch(userAsyncActions.login(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <IonList>
        <div className="ion-no-border">
          <IonInput
            label-placement="floating"
            fill="outline"
            label="Email"
            placeholder="Email"
            {...register("email", {
              required: "This is a required field",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "invalid email address",
              },
            })}
          />
          <span style={{ color: "red" }}>{errors.email?.message}</span>
        </div>

        <div className="ion-no-border ion-margin-top ion-margin-bottom">
          <IonInput
            label-placement="floating"
            fill="outline"
            label="Password"
            placeholder="Password"
            type="password"
            {...register("password", {
              required: "This is a required field",
            })}
          />
          <span style={{ color: "red" }}>{errors.password?.message}</span>
        </div>

        <IonButton type="submit" size="large" disabled={isFetching}>
          {isFetching ? "loading..." : "Sign in"}
        </IonButton>
      </IonList>
    </form>
  );
};
