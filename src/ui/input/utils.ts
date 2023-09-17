import { PreemieInputProps } from '@ui';

// map onChange to onIonChange etc.
export const mapHandlers = (props: PreemieInputProps) => {
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
