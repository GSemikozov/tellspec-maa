import { format, startOfDay } from 'date-fns';

export const formatUTCDate = (date: Date) =>
    `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;

export const setStartDay = (date: Date) =>
    format(startOfDay(date), 'yyyy-MM-dd') + 'T00:00:00.000Z';

export const setEndDay = (date: Date) => format(startOfDay(date), 'yyyy-MM-dd') + 'T23:59:59.000Z';
