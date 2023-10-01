import React from 'react';
import { useIonToast } from '@ionic/react';

import { classname } from '@shared/utils';

import type { ToastOptions } from '@ionic/core/components';
import type { HookOverlayOptions } from '@ionic/react/dist/types/hooks/HookOverlayOptions';

const cn = classname('preemie-toast');

type presentToastOptions = ToastOptions &
    HookOverlayOptions & {
        type?: 'success' | 'error';
        delay?: number;
    };

export const usePreemieToast = (): [
    (presentOptions: presentToastOptions) => Promise<void>,
    () => Promise<void>,
] => {
    const [presentToast, dismissToast] = useIonToast();

    const presentPreemieToast = React.useCallback(
        async (presentOptions: presentToastOptions) => {
            const {
                type,
                animated = false,
                position = 'top',
                duration = 4500,
                delay,
                ...otherPresentOptions
            } = presentOptions;

            const preemieToastCssClass = cn('', {
                success: type === 'success',
                error: type === 'error',
            });

            const cssClass = [preemieToastCssClass, otherPresentOptions.cssClass ?? '']
                .join(' ')
                .trim();

            if (delay) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            await dismissToast();

            await presentToast({
                ...otherPresentOptions,
                animated,
                position,
                duration,
                cssClass,
            });
        },
        [presentToast],
    );

    return [presentPreemieToast, dismissToast];
};
