import React from 'react';
import { IonToast } from '@ionic/react';

import { classname } from '@shared/utils';

import type { JSX } from '@ionic/core/components';

import './preemie-toast.css';

const cn = classname('preemie-toast');

export type PreemieToastProps = JSX.IonToast & {
    id?: string;
    type?: 'success' | 'error';
    className?: string;
};

export const PreemieToast: React.FunctionComponent<PreemieToastProps> = ({
    type,
    className,
    ...otherProps
}) => {
    let toastClassName =
        cn('', {
            success: type === 'success',
            error: type === 'error',
        }) ?? '';

    if (className) {
        toastClassName += ' ' + className;
    }
    return <IonToast className={toastClassName} {...otherProps} />;
};
