import React from 'react';

import { pageAreaCn } from './internal';

import './page-area.css';

export type PageAreaProps = React.PropsWithChildren<{
    className?: string;
}>;

export const PageArea: React.FunctionComponent<PageAreaProps> = ({
    className,

    children,
}) => {
    return <div className={pageAreaCn('', [className])}>{children}</div>;
};
