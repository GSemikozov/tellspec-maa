import type { ApexOptions } from 'apexcharts';

export const DEFAULT_SERIES_DATA = [{ data: [] }];

export const DEFAULT_MILK_CHART_OPTIONS: ApexOptions = {
    chart: {
        background: '#FFF',
        height: 280,
        type: 'line',
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
    },

    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'smooth',
    },
    grid: {
        show: false,
        padding: {
            top: 10,
            right: 25,
            bottom: 10,
            left: 25,
        },
        xaxis: {
            lines: {
                show: true,
            },
        },
        yaxis: {
            lines: {
                show: true,
            },
        },
    },
    yaxis: {
        tickAmount: 5,
        title: {
            text: 'Absorbance',
            offsetX: -10,
            style: {
                fontSize: '1.5em',
                fontWeight: 400,
            },
        },
        labels: {
            style: { fontSize: '1.5em', fontWeight: 400 },

            /**
             * Allows users to apply a custom formatter function to yaxis labels.
             *
             * @param { String } value - The generated value of the y-axis tick
             * @param { index } index of the tick / currently executing iteration in yaxis labels array
             */
            formatter: function (val: number) {
                return val.toFixed(2);
            },
        },
    },
    colors: ['#E503B0'],
    xaxis: {
        tickAmount: 5,
        tickPlacement: 'between',
        title: {
            text: 'Wavelength (nm)',
            style: {
                fontSize: '1.5em',
                fontWeight: 400,
            },
        },
        categories: [],
        labels: {
            style: { fontSize: '1.5em', fontWeight: 400 },
            /**
             * Allows users to apply a custom formatter function to yaxis labels.
             *
             * @param { String } value - The generated value of the y-axis tick
             * @param { index } index of the tick / currently executing iteration in yaxis labels array
             */
            formatter: function (value: string) {
                return Number(value).toFixed(1); //`${(1350 + ((val - 1) * 3.137254902)).toFixed(0)}` ;
            },
        },
    },
};
