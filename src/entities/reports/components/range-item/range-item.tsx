import React from 'react';

import './range-item.css';

type RangeItemProps = {
    generalRange: any;
    value: any;
    unit: any;
    normalRangeWidth: any;
};

export const RangeItem: React.FC<RangeItemProps> = ({
    generalRange,
    value,
    unit,
    normalRangeWidth,
}) => {
    const ghostValue = generalRange[1] - generalRange[0];
    const unitPercentage =
        ((value - generalRange[0]) * 100) /
        (generalRange[generalRange.length - 1] - generalRange[0] + ghostValue);

    const tickWidth = 100 / generalRange.length;
    const percentageCorrection = tickWidth / 2;

    const Tooltip = (
        <div
            className={'tooltip'}
            style={{
                left: `calc(${unitPercentage}% + ${percentageCorrection}%)`,
                transform: `translateX(-${50}%)`,
            }}
        >
            <div className={'tooltipValue'}>{value}</div>
            <div className={'tooltipUnit'}>{unit}</div>
            <div className={'tooltipArrow'}></div>
        </div>
    );

    return (
        <div className={'rangeMain'}>
            {Tooltip}
            <div className={'rangeNormal'} style={{ width: `${normalRangeWidth}%` }}>
                Normal Range
            </div>
            <div className={'rangeRuler'}>
                {generalRange.map(number => {
                    return (
                        <div
                            className={'rangeItem'}
                            key={number * Math.random()}
                            style={{ width: `${tickWidth}%` }}
                        >
                            <span>{number}</span>
                            <div className={'rangeTick'}></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
