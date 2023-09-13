import type { BaseIconProps } from '../types';

export const AddMilkIcon: React.FunctionComponent<BaseIconProps> = ({
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
                d='M16.9824 25C19.6063 25 21.7334 22.8464 21.7334 20.1897C21.7334 17.5331 19.6063 15.3795 16.9824 15.3795C14.3585 15.3795 12.2314 17.5331 12.2314 20.1897C12.2314 22.8464 14.3585 25 16.9824 25Z'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path d='M14.9373 20.1899H19.0275' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M16.9824 18.1193V22.2605' strokeLinecap='round' strokeLinejoin='round' />
            <path
                d='M22.7571 5.28007L24.5888 3.42549C25.1371 2.87034 25.1371 1.97073 24.5888 1.41636C24.0405 0.861214 23.152 0.861214 22.6044 1.41636L20.7727 3.27094L20.0186 2.50742C19.4498 1.93152 18.5271 1.93152 17.9575 2.50742C17.3887 3.08333 17.3887 4.01754 17.9575 4.59421L21.4098 8.08962C21.9787 8.66553 22.9014 8.66553 23.4709 8.08962C24.0397 7.51372 24.0397 6.57951 23.4709 6.00283L22.7571 5.28007Z'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M22.8561 9.55277L16.5115 3.12904C15.9423 2.55282 15.0196 2.55282 14.4505 3.12904C13.8813 3.70526 13.8813 4.63951 14.4505 5.21573L20.7951 11.6395C21.3642 12.2157 22.2869 12.2157 22.8561 11.6395C23.4252 11.0632 23.4252 10.129 22.8561 9.55277Z'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M19.1249 15.2631C19.6739 14.568 19.863 13.9975 19.942 13.1032L20.1326 10.9411L15.0764 5.82178L12.574 5.89944C11.4311 5.9348 10.3444 6.41075 9.53558 7.22886L1.75981 15.1024C0.746731 16.1281 0.746731 17.792 1.75981 18.8177L6.93378 24.0562C7.94686 25.0819 9.59026 25.0819 10.6033 24.0562L12.5581 22.077'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M10.4065 6.97559L12.7098 9.30765'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M8.29919 8.91443L9.83248 10.4668'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M6.34619 11.0869L8.64877 13.419'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M4.23096 13.0337L5.76348 14.5861'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M2.32727 15.1559L4.62985 17.488'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};
