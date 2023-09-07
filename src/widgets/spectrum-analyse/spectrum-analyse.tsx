import React from 'react';

interface SpectrumAnalyseProps {
    milkID: string;
}

export const SpectrumAnalyse: React.FunctionComponent<SpectrumAnalyseProps> = props => {
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
    );
};
