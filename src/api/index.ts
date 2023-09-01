import { UserApi } from "../entities/user/user.api";
import { DonorsApi } from "../entities/donors/donors.api";
import { GroupsApi } from "../entities/groups/groups.api";
import { MilkApi } from "../entities/milk/milk.api";
import { ReportsApi } from "../entities/reports/reports.api";
export class API {
  public readonly users: UserApi;
  public readonly donors: DonorsApi;
  public readonly groups: GroupsApi;
  public readonly milk: MilkApi;
  public readonly reports: ReportsApi;

  constructor() {
    this.users = new UserApi(this);
    this.donors = new DonorsApi(this);
    this.groups = new GroupsApi(this);
    this.milk = new MilkApi(this);
    this.reports = new ReportsApi(this);
  }
}
