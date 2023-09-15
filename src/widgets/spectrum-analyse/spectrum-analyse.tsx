import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import {useDispatch, useSelector} from 'react-redux';

import {getPairDevice, getScanById, selectSensorCalibrationLoading} from '@entities/sensor';
import { EMULATION_SCAN_ID } from '@entities/sensor/sensor.constants.ts';
import {AppDispatch} from "@app";
import { Preloader } from "@ui/preloader";

import { generateMilkChartConfig } from './config';

import './spectrum-analyse.css';

type SpectrumAnalyseProps = {
    milkID: string;
};

export const SpectrumAnalyse: React.FunctionComponent<SpectrumAnalyseProps> = props => {
    const { milkID } = props;
    const dispatch = useDispatch<AppDispatch>();
    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const scanData = useSelector(getScanById(EMULATION_SCAN_ID));
    const isLoading = useSelector(selectSensorCalibrationLoading);
    const options = useMemo(() => generateMilkChartConfig(scanData), [scanData]);

    console.log("SpectrumAnalyse scanData", scanData)

    useEffect(() => {
        if (!milkID) {
            return;
        }

        // TODO: dispatch data
        dispatch(getPairDevice);
    }, [milkID]);

    useEffect(() => {
        setWidth(containerRef.current?.offsetWidth || 0);
    }, []);

    if (!scanData) {
        return <div>Not found</div>;
    }

    return (
        <div className='spectrum-analyse' ref={containerRef}>
            <Preloader isLoading={isLoading}>
                <Chart
                    width={width}
                    height={379}
                    options={options}
                    series={[{ data: scanData?.absorbance }]}
                    type='line'
                />
            </Preloader>
        </div>
    );
};
