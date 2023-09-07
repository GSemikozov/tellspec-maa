import { BaseEndpoint } from '@api/network';
import { getUserLocalData } from '@entities/user/user.utils';

import type { IReport, IReportRequestParam } from './model/reports.types';

export class ReportsApi extends BaseEndpoint {
    private reportUrl = 'main/reports/';

    addReport = async (report: IReport): Promise<void> => {
        const userData = await getUserLocalData();
        const response = await this.http.post(this.reportUrl, report, {
            preemie_group_id: userData?.metadata.group_id,
        });
        const { data, error } = response;

        if (data) {
            return data;
        }

        if (error) {
            throw new Error(error.message);
        }
    };

    updateReport = async (report: IReport): Promise<void> => {
        const userData = await getUserLocalData();
        const response = await this.http.patch(this.reportUrl, report, {
            uuid: report.uuid,
            preemie_group_id: userData?.metadata.group_id,
        });
        const { data, error } = response;

        if (data) {
            return data;
        }

        if (error) {
            throw new Error(error.message);
        }
    };

    deleteReport = async (report: IReport): Promise<void> => {
        const userData = await getUserLocalData();
        const response = await this.http.delete(this.reportUrl, {
            uuid: report.uuid,
            preemie_group_id: userData?.metadata.group_id,
        });
        const { data, error } = response;

        if (data) {
            return data;
        }

        if (error) {
            throw new Error(error.message);
        }
    };

    fetchReport = async (param: IReportRequestParam): Promise<IReport[]> => {
        const userData = await getUserLocalData();
        const tempParam = {
            ...param,
            preemie_group_id: userData?.metadata.group_id,
        };

        const response = await this.http.get(this.reportUrl, tempParam);
        const { data, detail } = response;

        if (!detail && data) {
            return data;
        } else {
            throw new Error(detail);
        }
    };
}
