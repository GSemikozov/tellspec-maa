import React from 'react';

import { pageAreaCn } from './internal';

export type PageAreaMainProps = React.PropsWithChildren<{
    className?: string;
}>;

export const PageAreaMain: React.FunctionComponent<PageAreaMainProps> = ({
    className,
    children,
}) => {
    return <div className={pageAreaCn('main', [className])}>{children}</div>;
};
