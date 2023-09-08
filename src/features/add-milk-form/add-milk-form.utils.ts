import type { AddMilkFormFieldValues } from './add-milk-form';

export const buildMilkData = (milk: AddMilkFormFieldValues) => {
    return {
        milk_id: milk.milkId,
        data: {},
        donor: milk.donorId,
        archived: false,
        created_at: new Date().toISOString(),
        last_modified_at: new Date().toISOString(),
        sensitive_data: {
            notes: '',
            receivedDate: milk.receivedDate,
            sourceId: milk.donorId,
            volume: milk.milkVolume,
            expirationDate: milk.milkExpirationDate,
            volumeUnit: 'ml',
        },
    };
};
