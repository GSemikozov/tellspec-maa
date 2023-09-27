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
    step: number;
};

const SCALE_VALUES: Record<string, ScaleValue> = {
    Energy: {
        minRequiredValue: 30,
        maxRequiredValue: 80,
        step: 10,
    },
    'Protein (True Protein)': {
        minRequiredValue: 0.6,
        maxRequiredValue: 1.4,
        step: 0.2,
    },
    Fat: {
        minRequiredValue: 2,
        maxRequiredValue: 5,
        step: 1,
    },
    'Total Carbs': {
        minRequiredValue: 11,
        maxRequiredValue: 15,
        step: 1,
    },
    'Total solids': {
        minRequiredValue: 5,
        maxRequiredValue: 12,
        step: 1,
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
        return <div className={cn('placeholder')}>This milk has not been analysed</div>;
    }

    if (!reportMilk.data.analyseData) {
        return <div className={cn('placeholder')}>This milk has not been analysed</div>;
    }

    // TODO: we have to process somehow multiple scan results on the Test Results page
    const analyseData = reportMilk.data.analyseData.result || reportMilk.data.analyseData[0];

    return (
        <div className={cn('scales')}>
            {analyseData.map(data => {
                const { name, units, value } = data;
                const { minRequiredValue, maxRequiredValue, step } = SCALE_VALUES[name] || {};

                return (
                    <Scale
                        key={data.name}
                        label={name}
                        value={typeof value === 'string' ? parseFloat(value) : value}
                        units={units}
                        minRequiredValue={minRequiredValue}
                        maxRequiredValue={maxRequiredValue}
                        step={step}
                    />
                );
            })}
        </div>
    );
};
