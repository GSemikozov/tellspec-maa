import * as React from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { userAsyncActions, userSelectors } from "../../entities/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";

interface FieldValues {
  milkId: string;
  donor: string;
  milkVolume: string;
  numberOfContainers: number;
  infantDeliveryDate: Date | string;
  milkExpressionDate: Date | string;
  milkExpirationDate: Date | string;
  receivedDate: Date | string;
  storageFreezer: string;
  storageCompartment: string;
}

const defaultValues = {
  milkId: "",
  donor: "",
  milkVolume: "",
  numberOfContainers: 1,
  infantDeliveryDate: "",
  milkExpressionDate: "",
  milkExpirationDate: "",
  receivedDate: "",
  storageFreezer: "",
  storageCompartment: "",
};

export const AddMilkForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isFetching = useSelector(userSelectors.isUserFetching);
  const { register, formState, handleSubmit } = useForm<FieldValues>({
    defaultValues,
    mode: "onSubmit",
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Add Milk</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Add milk</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList>
            <div className="ion-margin-bottom">
              <IonSelect
                label="Milk ID"
                labelPlacement="floating"
                fill="outline"
                {...register("milkId", {
                  required: "This is a required field",
                })}
              >
                <IonSelectOption value="none"></IonSelectOption>
              </IonSelect>
              <span style={{ color: "red" }}>{errors.milkId?.message}</span>
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label-placement="floating"
                fill="outline"
                label="Donor ID"
                {...register("donor", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>{errors.donor?.message}</span>
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label-placement="floating"
                fill="outline"
                label="Milk volume"
                type="text"
                {...register("milkVolume", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>{errors.milkVolume?.message}</span>
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label-placement="floating"
                fill="outline"
                label="Number of Containers"
                type="number"
                {...register("numberOfContainers", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.numberOfContainers?.message}
              </span>
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label-placement="floating"
                fill="outline"
                label="infantDeliveryDate"
                type="date"
                {...register("infantDeliveryDate", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.infantDeliveryDate?.message}
              </span>
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label-placement="floating"
                fill="outline"
                label="Milk Expression Date"
                type="date"
                {...register("milkExpressionDate", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.milkExpressionDate?.message}
              </span>
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label-placement="floating"
                fill="outline"
                label="Milk Expiration Date"
                type="date"
                {...register("milkExpirationDate", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.milkExpirationDate?.message}
              </span>
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label-placement="floating"
                fill="outline"
                label="Received Date"
                type="date"
                {...register("receivedDate", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.receivedDate?.message}
              </span>
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label-placement="floating"
                fill="outline"
                label="Storage Freezer"
                type="text"
                {...register("storageFreezer", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.storageFreezer?.message}
              </span>
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label-placement="floating"
                fill="outline"
                label="Storage Compartment"
                type="text"
                {...register("storageCompartment", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.storageCompartment?.message}
              </span>
            </div>

            <IonButton type="submit" size="large" disabled={isFetching}>
              {isFetching ? "loading..." : "Add milk"}
            </IonButton>
          </IonList>
        </form>
      </IonContent>
    </IonPage>
  );
};
