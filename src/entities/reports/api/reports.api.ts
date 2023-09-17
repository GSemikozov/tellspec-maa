import { BaseEndpoint } from '@api/network';
import { getUserLocalData } from '@entities/user/user.utils';

import type { Report, FetchReportRequest } from './types';

export class ReportsApi extends BaseEndpoint {
    private reportUrl = '/main/reports/';

    addReport = async (report: Report) => {
        const userData = await getUserLocalData();
        const response = await this.http.post(this.reportUrl, report, {
            preemie_group_id: userData?.metadata.group_id,
        });

        return response;
    };

    updateReport = async (report: Report): Promise<void> => {
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

    deleteReport = async (report: Report): Promise<void> => {
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

    fetchReport = async (param: FetchReportRequest) => {
        const userData = await getUserLocalData();
        const tempParam = {
            ...param,
            preemie_group_id: userData?.metadata.group_id,
        };

        const response = await this.http.get<Report[]>(this.reportUrl, tempParam);

        return response;
    };
}
