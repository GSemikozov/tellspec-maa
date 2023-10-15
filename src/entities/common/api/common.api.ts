import { BaseEndpoint } from '@api/network';

import type { AddLogRequest, AddLogResponse } from './types';

export class CommonApi extends BaseEndpoint {
    private addLogUrl = '/logs/logApps/';

    addLog = async (request: Omit<AddLogRequest, 'app' | 'version_store' | 'date'>) => {
        const requestBody: AddLogRequest = {
            ...request,
            app: 'Preemie Milk Analysis App',
            version_store: '1',
            date: +new Date(),
        };

        const response = await this.http.post<AddLogResponse>(this.addLogUrl, requestBody);

        if (response.data) {
            return response.data;
        }

        return null;
    };
}
