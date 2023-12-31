import React from 'react';

import { classname } from '@shared/utils';

import { Scale } from './scale';
import { MockData } from './mock-data';

import type { Report } from '@entities/reports';

import './test-results.css';

const cn = classname('test-results');

type TestResultsProps = {
    reportMilk: Report | null | undefined;
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
    'Linoleic acid': {
        minRequiredValue: 0, //385,
        maxRequiredValue: 0, //1540,
        step: 10,
    },
    '⍺-Linolenic acid': {
        minRequiredValue: 0,
        maxRequiredValue: 0,
        step: 10,
    },
    DHA: {
        minRequiredValue: 0, //30,
        maxRequiredValue: 0, //65,
        step: 10,
    },
    ARA: {
        minRequiredValue: 0, //30,
        maxRequiredValue: 0, //100,
        step: 10,
    },
    EPA: {
        minRequiredValue: 0,
        maxRequiredValue: 0, //20,
        step: 10,
    },
};

export const TestResults: React.FunctionComponent<TestResultsProps> = ({ reportMilk }) => {
    const mockData = MockData.data;

    if (!reportMilk) {
        return <div className={cn('placeholder')}>This milk has not been analysed.</div>;
    }

    if (!reportMilk.data.analyseData) {
        return <div className={cn('placeholder')}>This milk has not been analysed.</div>;
    }

    // TODO: we have to process somehow multiple scan results on the Test Results page
    const analyseData = reportMilk.data.analyseData.result || reportMilk.data.analyseData[0];

    return (
        <div className={cn('scales')}>
            {Array.isArray(analyseData) &&
                analyseData
                    .filter(item => {
                        return item.name !== 'Total solids' && item.name !== 'Total Carbs';
                    })
                    .map(data => {
                        const { name, units, value } = data;
                        const { minRequiredValue, maxRequiredValue, step } =
                            SCALE_VALUES[name] || {};

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
            {analyseData &&
                mockData.map(data => {
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
