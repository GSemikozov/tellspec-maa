import React from "react";
import {IReport} from "../../entities/reports/model/reports.types.ts";

import IntrinsicAttributes = JSX.IntrinsicAttributes;

export const TestResults: React.FC<IntrinsicAttributes & IReport> = (props: IReport) => {
    console.log("TestResults analyseData", props)
    return (
        <div>test results tab</div>
    )
}