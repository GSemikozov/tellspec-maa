import { apiInstance } from '@api/network';

export const log = async (subject: string, payload: any, forServer = false): Promise<void> => {
    console.log(subject, `[stringified payload]: ${JSON.stringify(payload)}`);

    if (forServer) {
        await apiInstance.common.addLog({
            message: `${subject}/[payload]: ${JSON.stringify(payload)}`,
        });
    }
};

export const logForServer = async (subject: string, payload: any): Promise<void> =>
    log(subject, payload, true);
