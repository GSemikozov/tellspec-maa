import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import { classname } from '@shared/utils';
import { selectReportScanIdByMilkId } from '@entities/reports';
import { selectIsScanLoading, selectScanById } from '@entities/sensor';

import { generateMilkChartConfig } from './config';

import './spectrum-analyse.css';

const cn = classname('spectrum-analyse');

type SpectrumAnalyseProps = {
    milkId: string;
    analyseMilkLoading: boolean;
};

export const SpectrumAnalyse: React.FunctionComponent<SpectrumAnalyseProps> = ({
    milkId,
    analyseMilkLoading,
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const reportMilkScanId = useSelector(state => selectReportScanIdByMilkId(state, milkId));
    const sensorScanLoading = useSelector(selectIsScanLoading);
    const sensorScan = useSelector(state => selectScanById(state, reportMilkScanId));

    const [width, setWidth] = React.useState(0);

    React.useLayoutEffect(() => {
        setWidth(containerRef.current?.offsetWidth || 0);
    }, []);

    const { options, series } = React.useMemo(() => {
        if (!sensorScan) {
            return {
                options: {},
                series: [],
            };
        }

        return {
            options: generateMilkChartConfig(sensorScan),
            series: [{ data: sensorScan.absorbance }],
        };
    }, [sensorScan]);

    const renderMain = React.useMemo(() => {
        if (analyseMilkLoading) {
            return <div className={cn('placeholder')}>Analyse loading...</div>;
        }

        if (sensorScanLoading) {
            return <div className={cn('placeholder')}>Loading scanned data...</div>;
        }

        if (!sensorScan) {
            return (
                <div className={cn('placeholder')}>
                    We haven't found a scanned data for this milk
                </div>
            );
        }

        return <Chart type='line' height={460} width={width} options={options} series={series} />;
    }, [
        analyseMilkLoading,
        reportMilkScanId,
        sensorScanLoading,
        sensorScan,
        width,
        options,
        series,
    ]);

    return (
        <div className={cn()} ref={containerRef}>
            {renderMain}
        </div>
    );
};
