import { isBefore, isDate, parse } from 'date-fns';
import * as yup from 'yup';

const parseDateString = (value: string): Date => {
    if (isDate(value)) {
        return value as unknown as Date;
    }

    return parse(value, 'yyyy-MM-dd', new Date());
};

const isDateBefore = (firstDate: Date, secondDate: Date) => {
    return isBefore(firstDate, secondDate);
};

export const validationSchema = yup.object({
    milkVolume: yup.string(),
    milkId: yup.string().required('This is a required field'),
    donorId: yup.string().required('This is a required field'),
    numberOfContainers: yup.number().required('This is a required field'),
    storageFreezer: yup.string().required('This is a required field'),
    storageCompartment: yup.string().required('This is a required field'),

    receivedDate: yup.string().required('This is a required field'),
    milkExpirationDate: yup.string().required('This is a required field'),

    infantDeliveryDate: yup.string().required('This is a required field'),

    milkExpressionDate: yup
        .string()
        .test({
            exclusive: false,
            name: 'validate milkExpressionDate and infantDeliveryDate',
            test: (_: unknown, { parent, createError }: yup.TestContext<unknown>) => {
                const {
                    milkExpressionDate: milkExpressionDateString,
                    infantDeliveryDate: infantDeliveryDateString,
                } = parent;

                if (!milkExpressionDateString || !infantDeliveryDateString) {
                    return true;
                }

                const milkExpressionDate = parseDateString(milkExpressionDateString);
                const infantDeliveryDate = parseDateString(infantDeliveryDateString);

                if (isDateBefore(milkExpressionDate, infantDeliveryDate)) {
                    return createError({
                        path: 'milkExpressionDate',
                        message: "Milk expression date can't be before infant delivery date",
                    });
                }

                return true;
            },
        })
        .test({
            exclusive: false,
            name: 'validate milkExpressionDate and ReceivedDate',
            test: (_: unknown, { parent, createError }: yup.TestContext<unknown>) => {
                const {
                    milkExpressionDate: milkExpressionDateString,
                    receivedDate: receivedDateString,
                } = parent;

                if (!milkExpressionDateString || !receivedDateString) {
                    return true;
                }

                const milkExpressionDate = parseDateString(milkExpressionDateString);
                const receivedDate = parseDateString(receivedDateString);

                if (isDateBefore(receivedDate, milkExpressionDate)) {
                    return createError({
                        path: 'milkExpressionDate',
                        message: "Milk expression date can't be after delivery date",
                    });
                }

                return true;
            },
        })
        .required('This is a required field'),
});

export type AddMilkFormFieldValues = yup.InferType<typeof validationSchema>;

export const buildMilkData = (milk: AddMilkFormFieldValues) => {
    return {
        milk_id: milk.milkId,
        data: {},
        donor: milk.donorId,
        archived: false,
        created_at: new Date().toISOString(),
        last_modified_at: new Date().toISOString(),
        reports: [],
        sensitive_data: {
            sourceId: milk.donorId,
            numberOfContainers: milk.numberOfContainers,
            expirationDate: milk.milkExpirationDate,
            expressionDate: milk.milkExpressionDate,
            infantDeliveryDate: milk.infantDeliveryDate,
            receivedDate: milk.receivedDate,
            storageFreezer: milk.storageFreezer,
            storageCompartment: milk.storageCompartment,

            notes: '',
            volume: milk.milkVolume ?? '',
            volumeUnit: 'ml',
        },
    };
};
