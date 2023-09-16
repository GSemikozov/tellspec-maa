import React from 'react';
import { useIonToast } from '@ionic/react';

import { classname } from '@shared/utils';

import type { ToastOptions } from '@ionic/core/components';
import type { HookOverlayOptions } from '@ionic/react/dist/types/hooks/HookOverlayOptions';

const cn = classname('preemie-toast');

type presentToastOptions = ToastOptions &
    HookOverlayOptions & {
        type?: 'success' | 'error';
    };

export const usePreemieToast = () => {
    const [presentToast, dismissToast] = useIonToast();

    const presentPreemieToast = React.useCallback(
        async (presentOptions: presentToastOptions) => {
            const {
                type,
                position = 'top',
                duration = 3000,
                ...otherPresentOptions
            } = presentOptions;

            const preemieToastCssClass = cn('', {
                success: type === 'success',
                error: type === 'error',
            });

            const cssClass = [preemieToastCssClass, otherPresentOptions.cssClass ?? '']
                .join(' ')
                .trim();

            await presentToast({
                ...otherPresentOptions,
                position,
                duration,
                cssClass,
            });
        },
        [presentToast],
    );

    return [presentPreemieToast, dismissToast];
};
