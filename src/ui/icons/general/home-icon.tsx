import type { BaseIconProps } from '../types';

export const HomeIcon: React.FunctionComponent<BaseIconProps> = ({
    size = 24,
    color = '#999999',
    ...otherProps
}) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 26 26'
            fill='none'
            width={size}
            height={size}
            stroke={color}
            {...otherProps}
        >
            <path
                d='M15.1433 16.4886C15.1433 17.5977 14.2164 18.4966 13.0726 18.4966C11.9289 18.4966 11.002 17.5977 11.002 16.4886C11.002 15.3795 13.0726 13.0798 13.0726 13.0798C13.0726 13.0798 15.1433 15.3795 15.1433 16.4886Z'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M3.3125 10.9526V24.1235C3.3125 24.6079 3.71749 24.9999 4.21622 24.9999H21.9292C22.4286 24.9999 22.8329 24.6072 22.8329 24.1235V11.0268'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M24.2481 8.13818L16.0397 2.92873L13 1L9.9611 2.92873L1.75336 8.13818C0.98388 8.62618 0.768637 9.62691 1.27187 10.3724C1.77511 11.1178 2.80707 11.3273 3.5758 10.8393L13 4.85746L22.4242 10.8393C23.1937 11.3273 24.2249 11.1185 24.7281 10.3724C25.2314 9.62618 25.0161 8.62618 24.2466 8.13818H24.2481Z'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};
