import React from 'react';

import { classname } from '@shared/utils';

import './sensor-manager-instructions.css';
import { IonAccordion, IonAccordionGroup, IonItem } from '@ionic/react';

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
            {/* <IonAccordionGroup>
                <IonAccordion value='first'>
                    <IonItem slot='header' color='none' className={cn('title')}>
                </IonItem> */}
                <div>{title}</div>
                    <div className={cn('content')} slot='content'>
                        {children}
                    </div>
                {/* </IonAccordion>
            </IonAccordionGroup> */}
        </div>
    );
};
