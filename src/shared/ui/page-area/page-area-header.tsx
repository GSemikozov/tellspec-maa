import React from 'react';

import { pageAreaCn } from './internal';

export type PageAreaHeaderProps = {
    title: string;

    icon?: React.ReactElement;
    actions?: React.ReactNode;
    className?: string;
};

export const PageAreaHeader: React.FunctionComponent<PageAreaHeaderProps> = ({
    title,

    icon,
    actions,
    className,
}) => {
    return (
        <div className={pageAreaCn('header', [className])}>
            <div className={pageAreaCn('header-title')}>
                {icon ? (
                    <div className={pageAreaCn('header-title-icon')}>
                        {React.cloneElement(icon, { size: 32, color: 'currentColor' })}
                    </div>
                ) : null}

                <div className={pageAreaCn('header-title-text')}>{title}</div>
            </div>

            {actions ? <div className={pageAreaCn('header-actions')}>{actions}</div> : null}
        </div>
    );
};
