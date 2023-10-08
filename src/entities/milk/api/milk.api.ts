import { decrypt, encrypt } from '@api/shared';
import { BaseEndpoint } from '@api/network';
import { getUserLocalData } from '@entities/user/user.utils';

import type { Milk, AddMilkResponse } from './types';

/**
 * Handle converting the recieved server data to Milk type
 * @param milkPayload
 * @return Milk
 */
const decodeMilkInformation = async (source: any): Promise<Milk> => {
    const sensitiveData: string = source.sensitive_data;

    const result: Milk = {
        donor: source.donor,
        data: source.data,
        archived: source.archived,
        milk_id: source.milk_id,
        archived_at: source.archived_at,
        created_at: source.created_at,
        last_modified_at: source.last_modified_at,
        sensitive_data: source.sensitive_data,
        reports: [],
    };

    if (!sensitiveData || !sensitiveData.trim()) {
        throw new Error('Invalid sensitive data');
    }

    const decodedData = await decrypt(sensitiveData);

    if (decodedData && decodedData.trim()) {
        result.sensitive_data = JSON.parse(decodedData);
        return result;
    } else {
        throw new Error('Invalid sensitive data');
    }
};

/**
 * Handle converting the Milk type to what the server needs
 * @param source
 * @return Milk
 */
const encodeMilkInformation = async (source: Milk): Promise<any> => {
    if (!source.sensitive_data) {
        throw new Error('Invalid sensitive data');
    }

    const temp: string = JSON.stringify(source.sensitive_data);
    const result = await encrypt(temp);

    return {
        donor: source.donor,
        data: source.data,
        archived: source.archived,
        milk_id: source.milk_id,
        sensitive_data: result,
        archived_at: source.archived_at,
        created_at: source.created_at,
        last_modified_at: source.last_modified_at,
    };
};

export class MilkApi extends BaseEndpoint {
    private getMilksUrl = '/main/milks-all';
    private getMilksCompleteUrl = '/main/milks-all-complete/';
    private milkUrl = '/main/milks/';

    getMilkById = async (id: string) => {
        const userData = await getUserLocalData();

        const response = await this.http.get<Milk>(this.milkUrl, {
            preemie_group_id: userData?.metadata.group_id,
            milk_id: encodeURIComponent(id),
        });

        return response.data;
    };

    getMilksByIds = async (ids: string) => {
        const userData = await getUserLocalData();

        const response = await this.http.get<Milk[]>(this.getMilksCompleteUrl, {
            preemie_group_id: userData?.metadata.group_id,
            milks: ids,
        });

        return response.data;
    };

    getMilks = async () => {
        const userData = await getUserLocalData();

        const response = await this.http.get<Milk[]>(this.getMilksUrl, {
            preemie_group_id: userData?.metadata.group_id,
        });

        return response.data;
    };

    addMilk = async (milkData: Milk) => {
        const userData = await getUserLocalData();

        const requestBody = await encodeMilkInformation(milkData);

        const response = await this.http.post<AddMilkResponse>(this.milkUrl, requestBody, {
            preemie_group_id: userData?.metadata.group_id,
        });

        return response;
    };

    getMilk = async (milkId: string): Promise<Milk> => {
        try {
            const userData = await getUserLocalData();
            const Param = {
                preemie_group_id: userData?.metadata.group_id,
                milk_id: `${milkId}`,
            };

            const { data } = await this.http.get(`${this.milkUrl}`, Param);

            if (data) {
                return decodeMilkInformation(data);
            } else {
                throw new Error('internal error');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}
