import { UserApi } from '@entities/user/user.api';
import { DonorsApi } from '@entities/donors/donors.api';
import { GroupsApi } from '@entities/groups/groups.api';
import { MilkApi } from '@entities/milk/milk.api';
import { ReportsApi } from '@entities/reports/reports.api';
import { SensorApi } from '@entities/sensor';

export class API {
    public readonly users: UserApi;
    public readonly donors: DonorsApi;
    public readonly groups: GroupsApi;
    public readonly milk: MilkApi;
    public readonly reports: ReportsApi;
    public readonly sensor: SensorApi;

    constructor() {
        this.users = new UserApi(this);
        this.donors = new DonorsApi(this);
        this.groups = new GroupsApi(this);
        this.milk = new MilkApi(this);
        this.reports = new ReportsApi(this);
        this.sensor = new SensorApi(this);
    }
}

export const apiInstance = new API();
