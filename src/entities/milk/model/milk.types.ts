/* eslint-disable camelcase */
export interface IMilkList {
  status?: string;
  milk_id: string;
}

export interface IMILKSensitiveData {
  sourceId: string;
  volume: string;
  volumeUnit: string;
  notes: string;
  receivedDate: string;
  expirationDate: string;
}

export interface IMilk {
  milk_id: string;
  data: any;
  donor?: string;
  sensitive_data: IMILKSensitiveData;
  archived: boolean;
  archived_at?: string;
  last_modified_at?: string;
  created_at?: string;
}
