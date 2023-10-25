import { BaseEndpoint } from '@api/network';
import { getUserLocalData } from '@entities/user/user.utils';

import type { AddLogRequest, AddLogResponse } from './types';

export class CommonApi extends BaseEndpoint {
    private addLogUrl = '/logs/logApps/';

    addLog = async (request: Omit<AddLogRequest, 'app' | 'version_store' | 'date'>) => {
        const user = await getUserLocalData();

        const requestBody: AddLogRequest = {
            ...request,
            app: 'Preemie Milk Analysis App',
            version_store: '1',
            email: user?.email ?? '',
        };

        const response = await this.http.post<AddLogResponse>(this.addLogUrl, requestBody);

        if (response.data) {
            return response.data;
        }

        return null;
    };
}
