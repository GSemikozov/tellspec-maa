import React from 'react';
import Chart from 'react-apexcharts';

import { generateDefaultChartConfig } from './helpers';

import type { ApexOptions } from 'apexcharts';
import type { Calibration } from '@entities/sensor/model';

type SensorCalibrationChartProps = {
    variant: 'last-calibration' | 'reference-calibration';
    calibration: Calibration;
};

export const SensorCalibrationChart: React.FunctionComponent<SensorCalibrationChartProps> = ({
    variant,
    calibration,
}) => {
    const { options, series } = React.useMemo(() => {
        const calibrationScanData = calibration.scan['scan-data'];

        let series: ApexOptions['series'] = [];

        switch (variant) {
            case 'last-calibration': {
                const currentCalibrationSeries =
                    calibrationScanData.absorbance.length === 1
                        ? calibrationScanData.absorbance[0]
                        : calibrationScanData.absorbance;

                series = [{ data: currentCalibrationSeries }];
                break;
            }

            case 'reference-calibration': {
                const currentCalibrationSeries =
                    calibrationScanData.counts.length === 1
                        ? calibrationScanData.counts[0]
                        : calibrationScanData.counts;

                const factoryCalibrationSeries =
                    calibrationScanData.factory_white_ref.length === 1
                        ? calibrationScanData.factory_white_ref[0]
                        : calibrationScanData.factory_white_ref;

                series = [
                    { name: 'Current calibration', data: currentCalibrationSeries },
                    { name: 'Factory calibration', data: factoryCalibrationSeries },
                ];
                break;
            }
        }

        return {
            series,
            options: generateDefaultChartConfig(calibrationScanData),
        };
    }, [variant, calibration]);

    if (!options && !series) {
        return null;
    }

    return <Chart type='line' height={350} options={options} series={series} />;
};
