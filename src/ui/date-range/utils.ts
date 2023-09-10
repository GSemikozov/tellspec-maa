import { set } from 'date-fns';

export const getDefaultDate = () => {
    const date = set(new Date(), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
    });

    return date.toISOString();
};
