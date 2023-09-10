import React from 'react';

import { classname } from '@shared/utils';

import './sensor-manager-instructions.css';

const cn = classname('sensor-manager-instructions');

type SensorManagerInstructionsProps = {
    title: string;
    children: React.ReactNode;

    highlight?: boolean;
    className?: string;
};

export const SensorManagerInstructions: React.FunctionComponent<SensorManagerInstructionsProps> = ({
    title,
    children,

    highlight,
    className,
}) => {
    const rootClassName = [
        cn('', [className]) ?? '',
        cn('', { highlight: Boolean(highlight) }) ?? '',
    ].join(' ');

    return (
        <div className={rootClassName}>
            <div className={cn('title')}>{title}</div>
            <div className={cn('content')}>{children}</div>
        </div>
    );
};
