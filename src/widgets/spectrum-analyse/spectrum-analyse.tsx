import React from 'react';
import Chart from 'react-apexcharts';

import { defaultMilkChartConfig } from './config';

import type { IReport } from '@entities/reports/model/reports.types';

interface SpectrumAnalyseProps {
    analyseData: IReport;
}

export const SpectrumAnalyse: React.FunctionComponent<SpectrumAnalyseProps> = props => {
    const { analyseData } = props;

    if (!analyseData) {
        return null;
    }

    return (
        <div>
            {/* @ts-ignore, TODO: fix typing */}
            <Chart
                height={250}
                options={defaultMilkChartConfig}
                series={analyseData.data.analyseData}
                type='line'
            />
        </div>
    );
};
