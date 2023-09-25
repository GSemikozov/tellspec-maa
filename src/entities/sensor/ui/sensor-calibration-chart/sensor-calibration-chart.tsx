import React from 'react';
import Chart from 'react-apexcharts';

import { generateDefaultChartConfig } from './helpers';

import type { Calibration } from '@entities/sensor/model';

type SensorCalibrationChartProps = {
    calibration: Calibration;
};

export const SensorCalibrationChart: React.FunctionComponent<SensorCalibrationChartProps> = ({
    calibration,
}) => {
    const { options, series } = React.useMemo(() => {
        const calibrationScanData = calibration.scan['scan-data'];

        return {
            options: generateDefaultChartConfig(calibrationScanData),
            series: [{ data: calibrationScanData.absorbance }],
        };
    }, [calibration]);

    console.log('calibrationScanData calibration', calibration);
    console.log('calibrationScanData options', options);
    console.log('calibrationScanData series', series);

    return <Chart type='line' height={350} options={options} series={series} />;
};
