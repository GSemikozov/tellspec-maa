import { IAnalyseData } from "../../analyse/analyse.types";

export interface IDonorAllRequestData {
  completeData: boolean;
  showArchived: boolean;
}

export interface IDonor {
  uuid: string;
  data: IDonorData;
  sensitive_data: DonorSensitiveData;
  archived: boolean;
  archived_at?: string;
  last_modified_at?: string;
  created_at?: string;
}

export interface IDonorTableData extends IDonor {
  available_milk?: number;
  total_milk?: number;
  last_delivery?: string;
}

export interface IDonorEncrypted {
  uuid: string;
  data: IDonorData;
  sensitive_data: string | DonorSensitiveData;
  archived: boolean;
  archived_at?: string;
  last_modified_at?: string;
  created_at?: string;
}

interface IDonorData {
  blood_test?: string;
  survey?: string;
  lab?: string;
  donations?: IDonation[];
  pickUps?: IPickUp[];
  isPoolingDonor?: boolean;
}

interface DonorSensitiveData {
  name: string;
  surname: string;
  id: string;
  notes?: string;
  address: string;
  phone: string;
  email: string;
  enrollment: string;
  gestational_age: GestationalAge;
  childbirth: string;
}

interface GestationalAge {
  weeks: number;
  days: number;
}

export interface IDonorList {
  status?: string;
  uuid: string;
}

export type TDonationStatus = "received" | "completed";
export type TContainerStatus =
  | "stored"
  | "fulfilled"
  | "prepared"
  | "delivered"
  | "pooled";

export interface IDonation {
  milk_id: string;
  donation_date: string;
  expiration_date: string;
  containers: string;
  containerList: IContainer[];
  volume: string;
  storage: IStorage;
  status: TDonationStatus;
  delivery_date?: string;
  analysed?: string;
  milk_status?: string;
  bacterialTest?: IBacterialTest;
  pickUp_id?: string;
  donor_id?: string;
}

export interface IDonationTable extends IDonation {
  donor: IDonor;
}

export interface IContainer {
  container_id: string;
  volume: string;
  status: TContainerStatus;
  donation_id?: string;
  delivery_date?: string;
  destination?: string;
}

export interface IContainerTable extends IContainer {
  donor: IDonor;
}

export interface IContainerAnalysis extends IContainer {
  analyseData?: IAnalyseData;
}

interface IStorage {
  freezer: string;
  compartment: string;
}

export interface IBacterialTest {
  lab: string;
  date: string;
}

export interface IPickUp {
  volume: string;
  containers: string;
  address: string;
  phone: string;
  meeting: string;
  notes: string;
  pickUp_id: string;
  status: "pending" | "registered";
}

export interface IPickUpTable extends IPickUp {
  name: string;
  surname: string;
  donor_id: string;
  id: string;
}
