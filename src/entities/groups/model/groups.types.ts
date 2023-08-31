export interface IGetGroupsRequest {
  preemie_group_id?: string;
  member_type?: "admin" | "member";
  show_archived?: boolean;
}

export interface IMember {
  account_type: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface IGetMembers {
  data: {
    admins: IMember[];
    members: IMember[];
  };
}

export interface IGroup {
  preemie_group_id: string;
  name: string;
  data: IGroupData;
  sensitive_data: string;
  subscription: TSubscription;
  archived: boolean;
  archived_at: string;
  last_modified_at: string;
  created_at: string;
}

export type TSubscription = "full_pack" | "mobile_only" | "desktop_only";

interface IGroupData {
  storage: IFreezer[];
}

export interface IFreezer {
  name: string;
  freezer_id: string;
  compartments: string[];
  capacity?: string;
}

export interface IFreezerTable extends IFreezer {
  currentCap: number;
}
