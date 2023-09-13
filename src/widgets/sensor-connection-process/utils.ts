import { fillTemplateValues } from '@shared/string';

import { SensorConnectionProcessStatus } from './sensor-connection-process-context';
import { STATUS_TOAST_MESSAGE } from './const';

export type CreateToastMessagePayload = {
    discoveredDeviceLength?: number;
};

const REPLACE_KEY_MAP = {
    discoveredDeviceLength: 'count',
};

export const createToastMessage = (
    status: SensorConnectionProcessStatus,
    payload: CreateToastMessagePayload = {},
) => {
    const payloadWithReplacedKeys = Object.entries(payload).reduce((carry, [key, value]) => {
        carry[REPLACE_KEY_MAP[key]] = value;

        return carry;
    }, {});

    return fillTemplateValues(STATUS_TOAST_MESSAGE[status] ?? '', payloadWithReplacedKeys);
};
