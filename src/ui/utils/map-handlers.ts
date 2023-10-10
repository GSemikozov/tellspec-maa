import { PreemieInputProps, PreemieSelectProps } from '@ui';

// map onChange to onIonChange etc.
export const mapHandlers = (props: PreemieInputProps | PreemieSelectProps) => {
    return Object.entries(props).reduce((handlers, [key, value]) => {
        if (!key.startsWith('on')) {
            return handlers;
        }

        return {
            ...handlers,
            [key.replace('on', 'onIon')]: value,
        };
    }, {});
};
