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
    legend: {
        position: 'left',
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
            text: 'Intensity',
            offsetX: 0,

            style: {
                fontSize: '1.4em',
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
        tickAmount: 9,
        tickPlacement: 'between',
        categories: data?.wavelengths || [
            '1350',
            '1450',
            '1550',
            '1650',
            '1750',
            '1850',
            '1950',
            '2050',
            '2150',
        ],

        title: {
            text: 'Wavelength (nm)',
            style: {
                fontSize: '1.4em',
                fontWeight: 400,
            },
        },
        labels: {
            style: { fontSize: '1em', fontWeight: 400 },
            formatter: function (val: string) {
                return parseFloat(val).toFixed(0);
            },
        },
    },
    colors: ['#3dc04a', '#E503B0'],
});
