import React from 'react';
import Chart from 'react-apexcharts';

import { classname } from '@shared/utils';

import { generateMilkChartConfig } from './config';

import type { ScanResultType } from 'tellspec-sensor-sdk/src';

import './spectrum-analyse.css';

const cn = classname('spectrum-analyse');

type SpectrumAnalyseProps = {
    sensorScannedData: ScanResultType | null;
    onAnalyseMilk: () => Promise<void>;
};

export const SpectrumAnalyse: React.FunctionComponent<SpectrumAnalyseProps> = ({
    sensorScannedData,
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [width, setWidth] = React.useState(0);

    React.useLayoutEffect(() => {
        // workaround, cuz on first render we have not valid width
        const timeoutId = setTimeout(() => {
            setWidth(containerRef.current?.offsetWidth || 0);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const { options, series } = React.useMemo(() => {
        if (!sensorScannedData) {
            return {
                options: {},
                series: [],
            };
        }

        return {
            options: generateMilkChartConfig(sensorScannedData),
            series: [{ data: sensorScannedData.absorbance }],
        };
    }, [sensorScannedData]);

    if (!sensorScannedData) {
        return <div className={cn('placeholder')}>Not found sensor scanned data</div>;
    }

    return (
        <div className={cn()} ref={containerRef}>
            <Chart type='line' height={620} width={width} options={options} series={series} />
        </div>
    );
};
