import { set } from 'date-fns';

export const setDefaultTime = (date = new Date()) => {
    return set(date, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    }).toISOString();
}
