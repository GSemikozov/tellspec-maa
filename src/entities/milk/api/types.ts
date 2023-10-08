export type AddMilkResponse = {
    milk_id: string;

    status?: string;
};

export type MilkSensitiveData = {
    sourceId: string;
    numberOfContainers: number;
    expirationDate: string;
    expressionDate: string;
    infantDeliveryDate: string;
    receivedDate: string;
    storageFreezer: string;
    storageCompartment: string;

    notes: string;
    volume: string;
    volumeUnit: string;
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
