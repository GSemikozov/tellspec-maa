import type { BaseIconProps } from '../types';

export const LogoutIcon: React.FunctionComponent<BaseIconProps> = ({
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
                d='M3.28564 8.34694V2.15925C3.28564 1.51896 3.98272 1 4.84277 1H23.4428C24.3029 1 24.9999 1.51896 24.9999 2.15925V23.8407C24.9999 24.481 24.3029 25 23.4428 25H4.84277C3.98272 25 3.28564 24.481 3.28564 23.8407V17.1633'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M3.0305 14.7595L12.957 14.7595L12.957 17.7441L20.1724 12.7214L12.957 7.69763L12.957 10.8805L3.02951 10.8805C1.90862 10.8805 1.00001 11.7492 1.00001 12.8209C1.00001 13.8926 1.90862 14.7614 3.02951 14.7614L3.0305 14.7595Z'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};
