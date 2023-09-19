import type { BaseIconProps } from '../types';

export const SensorIcon: React.FunctionComponent<BaseIconProps> = ({
    size = 24,
    color = '#999999',
    ...otherProps
}) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='100 100 756 796'
            fill={color}
            width={size}
            height={size}
            stroke={color}
            {...otherProps}
            overflow='visible'
            
        >
            <g strokeWidth='0.2'>
            <path
                d='M940.7,727L531.1,32.8c-5.2-8.7-14.5-14.1-25.6-14.7c-4.6-0.3-9.1,1.4-12.3,4.5c-1.6,0.6-3.2,1.4-4.7,2.3
		L97,255.9c-1.5,0.9-3,1.9-4.3,3c-4.3,1.4-7.9,4.4-9.9,8.6c-4.8,10-4.6,20.8,0.6,29.5l409.5,694.1c5.1,8.7,14.4,14.1,25.5,14.7
		c0.3,0,0.6,0,1,0c2.5,0,4.9-0.6,7.1-1.6c3.4-0.7,6.8-2,9.8-3.8l391.5-231c3.1-1.8,5.8-4.1,8.1-6.8c2.2-1.6,4-3.7,5.2-6.2
		C946,746.5,945.8,735.7,940.7,727z M537.3,905.3c-7.5-29.8-21.7-62.8-40.9-95.5c0,0,0,0,0,0c-36.1-61.2-48.1-81.5-64.4-109.1
		c-11-18.6-76.3-129.4-128.8-218.3l-59.4-100.7c-19.3-32.6-41.3-61-63.8-82c-13.9-13-27.7-23-41.4-29.9L480.3,68.1
		c-0.6,15.3,1.5,32.2,6.1,50.7c7.5,29.9,21.6,62.9,40.9,95.5c21.6,36.6,78.9,133.8,125,211.8l127.7,216.4c19.3,32.6,41.3,61,63.9,82
		c14.5,13.6,29,23.8,43.2,30.7L543.5,957.9C544.2,942.1,542.2,924.6,537.3,905.3z M901.5,725.5c-30.2-14.6-63.9-50.3-93.1-99.8
		L680.7,409.4c-46-78-103.4-175.2-125-211.8c-29.2-49.4-44.1-96.2-42.3-129.8L901.5,725.5z M122.7,298.7
		c30,14.8,63.6,50.5,92.6,99.7l59.4,100.7c52.5,88.9,117.8,199.7,128.8,218.3c16.3,27.6,28.3,47.9,64.4,109.1
		c29.1,49.3,44.1,95.9,42.5,129.3L122.7,298.7z' 
            />
            <path
                d='M511.3,700.9c-8.9,5.2-11.9,16.7-6.6,25.6c5.3,8.9,16.7,11.9,25.6,6.6c8.9-5.2,11.9-16.7,6.6-25.6
		C531.7,698.6,520.2,695.7,511.3,700.9z' 
              
            />
            <path
                d='M561.5,693c5.3,8.9,16.7,11.9,25.6,6.6c8.9-5.3,11.9-16.7,6.6-25.6c-5.2-8.9-16.7-11.9-25.6-6.6
		C559.3,672.6,556.3,684.1,561.5,693z'
            />
            <path
                d='M644,666.1c8.9-5.2,11.9-16.7,6.6-25.6c-5.2-8.9-16.7-11.9-25.6-6.6c-8.9,5.3-11.9,16.7-6.6,25.6
		C623.6,668.4,635.1,671.3,644,666.1z'
            />
            <path
                d='M700.8,632.5c8.9-5.3,11.9-16.7,6.6-25.6c-5.3-8.9-16.7-11.9-25.6-6.6c-8.9,5.2-11.9,16.7-6.6,25.6
		C680.5,634.8,691.9,637.8,700.8,632.5z'
            />
            <path
                d='M568.2,360.4l-74-125.5c0,0,0,0,0,0c-8.4-14.2-26.7-18.9-40.9-10.5L355,283c-14.2,8.4-18.9,26.7-10.5,40.9
		l74,125.5c5.6,9.4,15.5,14.7,25.7,14.7c5.2,0,10.4-1.3,15.2-4.2l98.2-58.5C571.9,392.9,576.6,374.6,568.2,360.4z M445.4,429.8
		l-70.8-120l92.8-55.3l70.8,120L445.4,429.8z'
            />
            </g>
            
        </svg>
    );
};
