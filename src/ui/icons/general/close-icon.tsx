import type { BaseIconProps } from '../types';

export const CloseIcon: React.FunctionComponent<BaseIconProps> = ({
    size = 24,
    color = '#666666',
    ...otherProps
}) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 18 18'
            fill={color}
            width={size}
            height={size}
            {...otherProps}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M13 11.87L11.87 13L9 10.13L6.13 13L5 11.87L7.87 9L5 6.13L6.13 5L9 7.87L11.87 5L13 6.13L10.13 9L13 11.87ZM9 1C4.58 1 1 4.58 1 9C1 13.42 4.58 17 9 17C13.42 17 17 13.42 17 9C17 4.58 13.42 1 9 1Z'
            />
        </svg>
    );
};
