import type { BaseIconProps } from '../types';

export const TickIcon: React.FunctionComponent<BaseIconProps> = ({
    size = 24,
    color = '#CCCCCC',
    ...otherProps
}) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 18 18'
            width={size}
            height={size}
            fill={color}
            {...otherProps}
        >
            <path
                d='M6.18875 12.9387L3.06125 9.81125L2 10.8725L6.18875 15.0612L15.1888 6.06125L14.1275 5L6.18875 12.9387Z'
                fill='#666666'
            />
        </svg>
    );
};
