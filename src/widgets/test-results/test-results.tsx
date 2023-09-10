import React from 'react';
import { useDispatch } from 'react-redux';

import { appActions } from '@app';
import { classname } from '@shared/utils';

import { Scale } from './scale';
import { ActionsPanel } from './actions-panel';

import './test-results.css';

import type { IReport, IResult } from '@entities/reports/model/reports.types';
import type { AppDispatch } from '@app/store';

const cn = classname('test-results');

interface TestResultsProps {
    report: IReport | null;
}

interface ScaleValue {
    minRequiredValue: number;
    maxRequiredValue: number;
    scaleDivisionValue?: number;
}

const SCALE_VALUES: Record<string, ScaleValue> = {
    'Protein (True Protein)': {
        minRequiredValue: 0.6,
        maxRequiredValue: 1.4,
        scaleDivisionValue: 1,
    },
    Fat: {
        minRequiredValue: 2,
        maxRequiredValue: 5,
    },
    'Total Carbs': {
        minRequiredValue: 5,
        maxRequiredValue: 9,
    },
    Energy: {
        minRequiredValue: 30,
        maxRequiredValue: 80,
        scaleDivisionValue: 10,
    },
    'Total solids': {
        minRequiredValue: 5,
        maxRequiredValue: 12,
    },
};

export const TestResults: React.FC<TestResultsProps> = props => {
    const { report } = props;
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        if (report?.data.analyseData) {
            dispatch(appActions.hideSidebar());
        }

        return () => {
            dispatch(appActions.showSidebar());
        };
    }, [report]);

    if (!report || !report.data.analyseData) {
        return (
            <div className={cn('placeholder')}>
                We haven't found a report. Please analyse the milk
            </div>
        );
    }

    const latestAnalyse = report.data.analyseData[report.data.analyseData.length - 1];

    return (
        <div className='scales'>
            {latestAnalyse.result.map((data: IResult) => {
                const { name, units, value } = data;
                const { minRequiredValue, maxRequiredValue, scaleDivisionValue } =
                    SCALE_VALUES[name] || {};

                return (
                    <Scale
                        key={data.name}
                        label={name}
                        value={typeof value === 'string' ? parseFloat(value) : value}
                        units={units}
                        minRequiredValue={minRequiredValue}
                        maxRequiredValue={maxRequiredValue}
                        scaleDivisionValue={scaleDivisionValue}
                    />
                );
            })}

            <ActionsPanel />
        </div>
    );
};
