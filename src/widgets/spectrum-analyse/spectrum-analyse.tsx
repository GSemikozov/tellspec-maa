import React from "react";

import Chart from "react-apexcharts";
import { defaultMilkChartConfig } from "./config";

interface SpectrumAnalyseProps {
    milkID: string;
}

export const SpectrumAnalyse: React.FC<SpectrumAnalyseProps> = (props) => {
    const { milkID } = props;

    if (!milkID) {
        return null;
    }

    return (
        <div>
            {/* @ts-ignore, TODO: fix typing */}
            {/*<Chart
                height={250}
                options={defaultMilkChartConfig}
                series={analyseData.data.analyseData}
                type="line"
            />*/}
        </div>
    )
}