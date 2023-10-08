import type { ApexOptions } from 'apexcharts';

export const generateDefaultChartConfig = (data: any): ApexOptions => ({
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
        width: 3,
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
            offsetX: 0,
            style: {
                fontSize: '1em',
                fontWeight: 400,
            },
        },
        labels: {
            style: { fontSize: '1em', fontWeight: 400 },
            /**
             * Allows users to apply a custom formatter function to yaxis labels.
             *
             * @param { String } value - The generated value of the y-axis tick
             * @param { index } index of the tick / currently executing iteration in yaxis labels array
             */
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            formatter: function (val: number, index: number) {
                return val.toFixed(2);
            },
        },
    },
    xaxis: {
        tickAmount: 5,
        tickPlacement: 'between',
        categories: data?.wavelengths || [],
        title: {
            text: 'Wavelength (nm)',
            style: {
                fontSize: '1em',
                fontWeight: 400,
            },
        },
        labels: {
            style: { fontSize: '1em', fontWeight: 400 },
            formatter: function (val: string) {
                return parseFloat(val).toFixed(1);
            },
        },
    },
    colors: ['#E503B0', '#3dc04a'],
});
