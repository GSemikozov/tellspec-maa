import React, { useEffect, useMemo, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

import { getScanById } from "@entities/sensor";
import { EMULATION_SCAN_ID } from "@entities/sensor/sensor.constants.ts";

import { generateMilkChartConfig } from "./config";

import "./spectrum-analyse.css";

type SpectrumAnalyseProps = {
    milkID: string;
};

export const SpectrumAnalyse: React.FunctionComponent<SpectrumAnalyseProps> = props => {
    const { milkID } = props;

    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const scanData = useSelector(getScanById(EMULATION_SCAN_ID));
    const options = useMemo(() => generateMilkChartConfig(scanData), [scanData]);

    useEffect(() => {
        if (!milkID) {
            return;
        }

        // TODO: dispatch data
    }, [milkID]);

    useEffect(() => {
        setWidth(containerRef.current?.offsetWidth || 0);
    }, []);

    if (!scanData) {
        return <div>Not found</div>
    }

    return (
        <div className="spectrum-analyse" ref={containerRef}>
            <Chart
                width={width}
                height={379}
                options={options}
                series={[{ data: scanData?.absorbance }]}
                type="line"
            />
        </div>
    );
};
