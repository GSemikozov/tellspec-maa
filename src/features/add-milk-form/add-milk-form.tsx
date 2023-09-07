import * as React from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonInput,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonAlert,
} from "@ionic/react";
import { Controller, useForm } from "react-hook-form";
import { buildMilkData } from "./add-milk-form.utils";
import { getCompartmentList } from "../../entities/groups/model/groups.selectors";
import { addMilkFormSelectors, addMilkFormAsyncActions } from ".";
import { userSelectors } from "../../entities/user";
import { donorsAsyncActions, donorsSelectors } from "../../entities/donors";
import { groupsAsyncActions, groupsSelectors } from "../../entities/groups";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";

import type { IDonor } from "../../entities/donors/model/donors.types";
import { IFreezer } from "../../entities/groups/model/groups.types";
import { BarcodeScanner } from "../../ui";
import { CustomInput } from "../../ui/input/input";
import { CustomButton } from "../../ui/button/button";
import AddMilkIcon from "../../../assets/images/add-milk-selected.png";
import "./add-milk-form.css";

export interface AddMilkFormFieldValues {
  milkId: string;
  donorId: string;
  milkVolume: string;
  numberOfContainers: number;
  infantDeliveryDate: string;
  milkExpressionDate: string;
  milkExpirationDate: string;
  receivedDate: string;
  storageFreezer: string;
  storageCompartment: string;
}

const defaultValues = {
  milkId: "",
  donorId: "",
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
  const groupId = useSelector(userSelectors.getGroupId);
  const donorsList = useSelector(donorsSelectors.getAllDonors);
  const groupsList = useSelector(groupsSelectors.getGroup);
  const freezersList = useSelector(groupsSelectors.getFreezers);
  const isFetching: boolean | undefined = useSelector(
    addMilkFormSelectors.isMilkFormFetching
  );
  const [presentAlert] = useIonAlert();
  const {
    register,
    getValues,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm<AddMilkFormFieldValues>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const selectedStorageFreezer = watch("storageFreezer");
  const compartmentList = useSelector(
    getCompartmentList(selectedStorageFreezer)
  );

  React.useEffect(() => {
    dispatch(
      donorsAsyncActions.fetchDonors({
        completeData: true,
        showArchived: false,
      })
    );
    dispatch(groupsAsyncActions.fetchGroup({ preemie_group_id: groupId }));
  }, []);

  const handleAddMilkAndClearForm = async () => {
    const values = getValues();
    // @ts-ignore
    dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values)));
    await presentAlert({
      header: "The record has been saved",
      buttons: ["OK"],
      onDidDismiss: () => reset(),
    });
  };

  const handleAddMilkAndClose = async () => {
    const values = getValues();
    // @ts-ignore
    dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values)));
    await presentAlert({
      header: "The record has been saved",
      buttons: ["OK"],
      onDidDismiss: () => (window.location.href = "/"),
    });
  };

  const handleAddMilkAndAnalyse = async () => {
    const values = getValues();
    // @ts-ignore
    dispatch(addMilkFormAsyncActions.addMilk(buildMilkData(values)));
    await presentAlert({
      header: "The record has been saved",
      buttons: ["OK"],
      onDidDismiss: () => (window.location.href = "/analyse"),
    });
  };

  return (
    <form>
      <IonGrid id="add-milk-wrapper">
        <div className="add-milk-header">
          <h2>
            <IonText>
              {" "}
              <img src={AddMilkIcon} />
              Add Milk
            </IonText>
          </h2>

          <div className="ion-margin-top ion-margin-bottom" id="milk-id">
            <Controller
              defaultValue=""
              control={control}
              name="milkId"
              render={({ field }) => {
                return (
                  // @ts-ignore
                  <BarcodeScanner
                    {...field}
                    title="Milk ID"
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                  />
                );
              }}
            />
            <span style={{ color: "red" }}>{errors.milkVolume?.message}</span>
          </div>
        </div>
        <IonRow>
          <IonCol size="6">
            <div className="ion-margin-top ion-margin-bottom">
              <IonSelect
                className="add-milk-input"
                label="Donor ID"
                label-placement="floating"
                {...register("donorId", {
                  required: "This is a required field",
                })}
              >
                {donorsList.map((donor: IDonor) => (
                  <IonSelectOption key={donor.uuid} value={donor.uuid}>
                    {donor.sensitive_data.name} {donor.sensitive_data.surname} -{" "}
                    {donor.sensitive_data.id}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <span style={{ color: "red" }}>{errors.donorId?.message}</span>
            </div>

            <div className="ion-margin-top ion-margin-bottom">
              <IonSelect
                label="Storage Compartment"
                label-placement="floating"
                className="add-milk-input"
                {...register("storageCompartment", {
                  required: "This is a required field",
                })}
              >
                {compartmentList.map((compartment) => (
                  <IonSelectOption key={compartment} value={compartment}>
                    {compartment}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <span style={{ color: "red" }}>{errors.milkVolume?.message}</span>
            </div>

            <div className="ion-margin-top ion-margin-bottom">
              <CustomInput
                type="number"
                label="Number of Containers"
                label-placement="floating"
                {...register("numberOfContainers", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.numberOfContainers?.message}
              </span>
            </div>

            <div className="ion-margin-top ion-margin-bottom">
              <CustomInput
                type="date"
                label="Infant Delivery Date"
                label-placement="floating"
                {...register("infantDeliveryDate", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.infantDeliveryDate?.message}
              </span>
            </div>
          </IonCol>
          <IonCol size="6">
            <div className="ion-margin-top ion-margin-bottom">
              <CustomInput
                type="date"
                label="Milk Expression Date"
                label-placement="floating"
                {...register("milkExpressionDate", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.milkExpressionDate?.message}
              </span>
            </div>

            <div className="ion-margin-top ion-margin-bottom">
              <CustomInput
                type="date"
                label="Milk Expiration Date"
                label-placement="floating"
                {...register("milkExpirationDate", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.milkExpirationDate?.message}
              </span>
            </div>

            <div className="ion-margin-top ion-margin-bottom">
              <CustomInput
                type="date"
                label="Received Date"
                label-placement="floating"
                {...register("receivedDate", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.receivedDate?.message}
              </span>
            </div>

            <div className="ion-margin-top ion-margin-bottom">
              <IonSelect
                className="add-milk-input"
                label="Storage Freezer"
                label-placement="floating"
                {...register("storageFreezer", {
                  required: "This is a required field",
                })}
              >
                {freezersList.map((freezer: IFreezer) => (
                  <IonSelectOption
                    key={freezer.freezer_id}
                    value={freezer.freezer_id}
                  >
                    {freezer.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <span style={{ color: "red" }}>
                {errors.storageFreezer?.message}
              </span>
            </div>

            <div className="ion-margin-top ion-margin-bottom">
              <CustomInput
                type="text"
                label="Storage Compartment"
                label-placement="floating"
                {...register("storageCompartment", {
                  required: "This is a required field",
                })}
              />
              <span style={{ color: "red" }}>
                {errors.storageCompartment?.message}
              </span>
            </div>
          </IonCol>
        </IonRow>
        <IonRow className="button-wrapper">
          <CustomButton
            id="save-button"
            size="small"
            disabled={isFetching}
            onClick={handleAddMilkAndClearForm}
          >
            {isFetching ? "loading..." : "Save & Add Another Milk"}
          </CustomButton>

          <CustomButton
            id="save-button"
            size="small"
            disabled={isFetching}
            onClick={handleAddMilkAndClose}
          >
            {isFetching ? "loading..." : "Save this Milk and Close"}
          </CustomButton>

          <CustomButton
            id="save-button"
            size="small"
            disabled={isFetching}
            onClick={handleAddMilkAndAnalyse}
          >
            {isFetching ? "loading..." : "Save this Milk & Analyse"}
          </CustomButton>
        </IonRow>
      </IonGrid>
    </form>
  );
};
