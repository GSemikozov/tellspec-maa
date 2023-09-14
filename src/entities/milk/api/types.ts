export type AddMilkResponse = {
    milk_id: string;

    status?: string;
};

export type MilkSensitiveData = {
    sourceId: string;
    volume: string;
    volumeUnit: string;
    notes: string;
    receivedDate: string;
    expirationDate: string;
};

export type Milk = {
    milk_id: string;
    data: Record<string, any>;
    sensitive_data: MilkSensitiveData;
    archived: boolean;
    reports: unknown[];

    donor?: string;
    created_at?: string;
    archived_at?: string;
    last_modified_at?: string;
};
