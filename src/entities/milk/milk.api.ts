import { decrypt, encrypt } from '@api/shared';
import { BaseEndpoint } from '@api/network';
import { getUserLocalData } from '@entities/user/user.utils';

import type { IMilk, IMilkList } from './model/milk.types';

/**
 * Handle converting the recieved server data to IMilk type
 * @param milkPayload
 * @return IMilk
 */
const decodeMilkInformation = async (source: any): Promise<IMilk> => {
    const sensitiveData: string = source.sensitive_data;

    const result: IMilk = {
        donor: source.donor,
        data: source.data,
        archived: source.archived,
        milk_id: source.milk_id,
        archived_at: source.archived_at,
        created_at: source.created_at,
        last_modified_at: source.last_modified_at,
        sensitive_data: source.sensitive_data,
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
 * Handle converting the IMilk type to what the server needs
 * @param source
 * @return IMilk
 */
const encodeMilkInformation = async (source: IMilk): Promise<any> => {
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
    private milkUrl = 'main/milks/';

    addMilk = async (milkData: IMilk): Promise<IMilkList> => {
        try {
            const userData = await getUserLocalData();
            const result = await encodeMilkInformation(milkData);
            const { data } = await this.http.post(
                this.milkUrl,
                result,
                { preemie_group_id: userData?.metadata.group_id },
                {},
            );

            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    getMilk = async (milkId: string): Promise<IMilk> => {
        try {
            const userData = await getUserLocalData();
            const Param = {
                preemie_group_id: userData?.metadata.group_id,
                milk_id: `${milkId}`,
            };
            const { data, detail } = await this.http.get(`${this.milkUrl}`, Param, {});

            if (data) {
                return await decodeMilkInformation(data);
            } else {
                throw new Error(detail);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}
