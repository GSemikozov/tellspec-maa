import React from 'react';
import Chart from 'react-apexcharts';

import { classname } from '@shared/utils';

import { generateMilkChartConfig } from './config';

import './spectrum-analyse.css';

const cn = classname('spectrum-analyse');

type SpectrumAnalyseProps = {
    spectrumScan: any;
    spectrumScanLoading: boolean;
};

export const SpectrumAnalyse: React.FunctionComponent<SpectrumAnalyseProps> = ({
    spectrumScan,
    spectrumScanLoading,
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [width, setWidth] = React.useState(0);

    React.useLayoutEffect(() => {
        setTimeout(() => {
            requestAnimationFrame(() => {
                setWidth(containerRef.current?.offsetWidth || 0);
            });
        }, 300);
    }, []);

    const { options, series } = React.useMemo(() => {
        if (!spectrumScan) {
            return {
                options: {},
                series: [],
            };
        }

        return {
            options: generateMilkChartConfig(spectrumScan),
            series: [{ data: spectrumScan.absorbance }],
        };
    }, [spectrumScan]);

    const renderMain = React.useMemo(() => {
        if (spectrumScanLoading) {
            return <div className={cn('placeholder')}>Loading analysed data...</div>;
        }

        if (!spectrumScan) {
            return <div className={cn('placeholder')}>This milk has not been analysed.</div>;
        }

         return <Chart type='line' height={460} width={width} options={options} series={series} />;
    }, [spectrumScan, spectrumScanLoading, width, options, series]);

    return (
        <div className={cn()} ref={containerRef}>
            {renderMain}
        </div>
    );
};
