import { apiInstance } from '@api/network';

// TODO: to env
const ENABLED_NETWORK_COLLECT_LOGS = false;

export const log = async (subject: string, payload: any): Promise<void> => {
    console.log(subject, `[stringified payload]: ${JSON.stringify(payload)}`);

    if (!ENABLED_NETWORK_COLLECT_LOGS) {
        return;
    }

    await apiInstance.common.addLog({
        message: `subject:[stringified payload]: ${JSON.stringify(payload)}`,
    });
};
