import { PageArea as BasePageArea } from './page-area';
import { PageAreaHeader } from './page-area-header';
import { PageAreaMain } from './page-area-main';

export type { PageAreaProps } from './page-area';
export type { PageAreaHeaderProps } from './page-area-header';
export type { PageAreaMainProps } from './page-area-main';

export const PageArea = Object.assign(BasePageArea, { Header: PageAreaHeader, Main: PageAreaMain });
