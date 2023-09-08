import React from 'react';

import { classname } from '@shared/utils';

import './sensor-manager-instructions.css';

const cn = classname('sensor-manager-instructions');

type SensorManagerInstructionsProps = {
    title: string;
    children: React.ReactNode;

    className?: string;
};

export const SensorManagerInstructions: React.FunctionComponent<SensorManagerInstructionsProps> = ({
    title,
    children,

    className,
}) => {
    return (
        <div className={cn()}>
            <div className={cn('title')}>{title}</div>
            <div className={cn('content', [className])}>{children}</div>
        </div>
    );
};
