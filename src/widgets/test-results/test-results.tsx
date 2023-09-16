import React from 'react';
import { useDispatch } from 'react-redux';

import { classname } from '@shared/utils';
import { appActions } from '@app';

import { Scale } from './scale';

import type { Report } from '@entities/reports';
import type { AppDispatch } from '@app/store';

import './test-results.css';

const cn = classname('test-results');

type TestResultsProps = {
    reportMilk: Report | null;
};

type ScaleValue = {
    minRequiredValue: number;
    maxRequiredValue: number;
    scaleDivisionValue?: number;
};

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

export const TestResults: React.FunctionComponent<TestResultsProps> = ({ reportMilk }) => {
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        if (!reportMilk) {
            return;
        }

        if (reportMilk.data.analyseData) {
            dispatch(appActions.hideSidebar());
        }

        return () => {
            dispatch(appActions.showSidebar());
        };
    }, [reportMilk]);

    if (!reportMilk) {
        return (
            <div className={cn('placeholder')}>
                We haven't found a report. Please analyse the milk
            </div>
        );
    }

    if (!reportMilk.data.analyseData) {
        return (
            <div className={cn('placeholder')}>
                We haven't analysed data for this report. Please start analyse for get first data
            </div>
        );
    }

    return (
        <div className='scales'>
            {reportMilk.data.analyseData.result.map(data => {
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
        </div>
    );
};
