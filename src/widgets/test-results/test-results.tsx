import React from 'react';
import { useDispatch } from 'react-redux';

import { classname } from '@shared/utils';
import { appActions } from '@app';

import { Scale } from './scale';
import { MockData } from './mock-data';

import type { AppDispatch } from '@app/store';
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
    'Linolenic acid': {
        minRequiredValue: 0, //385,
        maxRequiredValue: 0, //1540,
        step: 77,
    },
    '⍺-Linolenic acid': {
        minRequiredValue: 0,
        maxRequiredValue: 0,
        step: 5,
    },
    DHA: {
        minRequiredValue: 0, //30,
        maxRequiredValue: 0, //65,
        step: 5,
    },
    ARA: {
        minRequiredValue: 0, //30,
        maxRequiredValue: 0, //100,
        step: 10,
    },
    EPA: {
        minRequiredValue: 0,
        maxRequiredValue: 0, //20,
        step: 1,
    },
};

export const TestResults: React.FunctionComponent<TestResultsProps> = ({ reportMilk }) => {
    const dispatch = useDispatch<AppDispatch>();

    const mockData = MockData.data;

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
        return <div className={cn('placeholder')}>This milk has not been analysed.</div>;
    }

    if (!reportMilk.data.analyseData) {
        return <div className={cn('placeholder')}>This milk has not been analysed.</div>;
    }

    // TODO: we have to process somehow multiple scan results on the Test Results page
    const analyseData = reportMilk.data.analyseData.result || reportMilk.data.analyseData[0];

    return (
        <div className={cn('scales')}>
            {analyseData
                .filter(item => {
                    console.log('scales name: ', item);
                    return item.name !== 'Total solids' && item.name !== 'Total Carbs';
                })
                .map(data => {
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

            {mockData.map(data => {
                console.log('mock data', data);
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
