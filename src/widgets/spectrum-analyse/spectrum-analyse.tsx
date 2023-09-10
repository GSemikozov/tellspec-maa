import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import { userSelectors } from '@entities/user';
import { tellspecRunScan } from '@api/native';
import { classname } from '@shared/utils';

import { DEFAULT_MILK_CHART_OPTIONS, DEFAULT_SERIES_DATA } from './config';

import './spectrum-analyse.css';

import type { ApexOptions } from 'apexcharts';

const cn = classname('spectrum-analyse');

type SpectrumAnalyseProps = {
    milkID: string;
};

export const SpectrumAnalyse: React.FunctionComponent<SpectrumAnalyseProps> = props => {
    const { milkID } = props;

    const userEmail = useSelector(userSelectors.selectUserEmail);

    const [currentScanData, setCurrentScanData] = React.useState(null);
    // const [scanResult, setScanResult] = React.useState(null);

    const [chartOptions, setChartOptions] = React.useState<ApexOptions>(DEFAULT_MILK_CHART_OPTIONS);
    const [chartSeries, setChartSeries] = React.useState(DEFAULT_SERIES_DATA);

    const updateChart = React.useCallback(async newScanData => {
        if (newScanData === null || newScanData.absorbance === null) {
            return;
        }

        // there a bug with react-apexcharts where it won't update the chart xaxis value after it has been set for the first time
        // this force it to use a new value
        setChartOptions(prevChartOptions => ({
            ...prevChartOptions,
            yaxis: {
                tickAmount: 5,
                tickPlacement: 'between',
                title: {
                    text: 'Absorbance',
                },
                labels: {
                    /**
                     * Allows users to apply a custom formatter function to yaxis labels.
                     *
                     * @param { String } value - The generated value of the y-axis tick
                     * @param { index } index of the tick / currently executing iteration in yaxis labels array
                     */
                    formatter: function (value: number) {
                        return value.toFixed(2);
                    },
                },
            },
            xaxis: {
                tickAmount: 5,
                tickPlacement: 'between',
                title: {
                    text: 'Wavelength (nm)',
                },
                categories: newScanData.wavelengths,
            },
        }));

        setChartSeries([{ data: newScanData.absorbance }]);

        // update scan results
        // const modelResult = await tellspecGetModelResult([newScanData.uuid]);
        // setScanResult(modelResult);

        //     getModelResult([newScan.uuid])
        //         .then(result => {
        //             setScanResult(result);
        //             if (!reportData) {
        //                 sendAlert({ type: 'error', message: 'Missing milk information' });
        //                 backdrop(false);
        //                 return;
        //             }

        //             reportData.data = {
        //                 ...reportData.data,
        //                 analyseData: {
        //                     scanId: newScan.uuid,
        //                     result: result,
        //                 },
        //             };
        //             PreemieSdk.Reports.update(reportData)
        //                 .then(() => {
        //                     backdrop(false);
        //                 })
        //                 .catch(error => {
        //                     console.log(error);
        //                     backdrop(false);
        //                 });
        //         })
        //         .catch(error => {
        //             console.error(error);
        //             backdrop(false);
        //         });
        // }
    }, []);

    React.useEffect(() => {
        if (!milkID || currentScanData !== null) {
            return;
        }

        const retrieveScan = async () => {
            const scanData = await tellspecRunScan(userEmail);

            updateChart(scanData);
            setCurrentScanData(scanData);
        };

        retrieveScan();
    }, [milkID, userEmail]);

    if (!milkID) {
        return null;
    }

    return (
        <div className={cn('')}>
            <Chart type='line' height={400} options={chartOptions} series={chartSeries} />
        </div>
    );
};
