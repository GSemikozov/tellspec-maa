import React from 'react';

import { classname } from '@shared/utils';

import { getBoundariesForValue, getDistanceBetweenNodes, getScaleValues } from './utils';

import './scale.css';

const cn = classname('scale');

type ScaleProps = {
    label: string;
    value: number;
    units: string;

    minRequiredValue: number;
    step: number;
    maxRequiredValue: number;
};

export const Scale: React.FunctionComponent<ScaleProps> = ({
    label,
    value,
    units,
    minRequiredValue,
    maxRequiredValue,
    step,
}) => {
    const scaleValuesRef = React.useRef<HTMLDivElement>(null);
    const scaleMarkerRef = React.useRef<HTMLDivElement>(null);
    const scaleTooltipRef = React.useRef<HTMLDivElement>(null);

    const scaleValues = React.useMemo(
        () =>
            getScaleValues({
                value,
                step,
                min: minRequiredValue,
                max: maxRequiredValue,
            }),
        [value, step, minRequiredValue, maxRequiredValue],
    );

    React.useLayoutEffect(() => {
        setTimeout(() => {
            requestAnimationFrame(() => {
                const scaleValuesElement = scaleValuesRef.current;
                const scaleMarkerElement = scaleMarkerRef.current;
                const scaleTooltipElement = scaleTooltipRef.current;

                if (!scaleValuesElement || !scaleMarkerElement || !scaleTooltipElement) {
                    return;
                }

                const scaleValuesChildElements = scaleValuesElement.children;
                const scaleValuesElementRect = scaleValuesElement.getBoundingClientRect();

                // arrange normal values marker
                {
                    const minRequiredValueIdx = scaleValues.findIndex(
                        scaleValue => scaleValue.value === minRequiredValue,
                    );

                    const maxRequiredValueIdx = scaleValues.findIndex(
                        scaleValue => scaleValue.value === maxRequiredValue,
                    );

                    if (
                        scaleValuesChildElements.length === 0 ||
                        minRequiredValueIdx === -1 ||
                        maxRequiredValueIdx === -1
                    ) {
                        return;
                    }

                    const [minRequiredValueNode, maxRequiredValueNode] = [
                        scaleValuesChildElements[minRequiredValueIdx],
                        scaleValuesChildElements[maxRequiredValueIdx],
                    ];

                    const minRequiredValueNodeRect = minRequiredValueNode.getBoundingClientRect();
                    const maxRequiredValueNodeRect = maxRequiredValueNode.getBoundingClientRect();

                    const adaptBoundaryRectToTranslate =
                        minRequiredValueNodeRect.right - scaleValuesElementRect.left;

                    const middlePointOfMinRequiredValueNode = minRequiredValueNodeRect.width / 2;

                    const translateX =
                        adaptBoundaryRectToTranslate - middlePointOfMinRequiredValueNode;

                    const distanceBetweenNodes = getDistanceBetweenNodes(
                        maxRequiredValueNodeRect,
                        minRequiredValueNodeRect,
                    );

                    const scaleX = distanceBetweenNodes / scaleMarkerElement.offsetWidth;

                    scaleMarkerElement.style.cssText += `transform: translateX(${translateX}px) scaleX(${scaleX})`;
                }

                // arange tooltip
                {
                    const [minBoundaryForValueIdx, maxBoundaryForValueIdx] = getBoundariesForValue({
                        scaleValues,
                        value,
                    });

                    const [minRequiredValueNode, maxRequiredValueNode] = [
                        scaleValuesChildElements[minBoundaryForValueIdx],
                        scaleValuesChildElements[maxBoundaryForValueIdx],
                    ];

                    const minRequiredValueNodeRect = minRequiredValueNode.getBoundingClientRect();
                    const maxRequiredValueNodeRect = maxRequiredValueNode.getBoundingClientRect();

                    const distanceBetweenNodes = getDistanceBetweenNodes(
                        maxRequiredValueNodeRect,
                        minRequiredValueNodeRect,
                    );

                    const minBoundaryValue = scaleValues[minBoundaryForValueIdx];

                    const adaptBoundaryRectToTranslate =
                        minRequiredValueNodeRect.left - scaleValuesElementRect.left;

                    const tooltipOffset =
                        (value - minBoundaryValue.value) / (step / distanceBetweenNodes);

                    const middlePointOfMinRequiredValueNode = minRequiredValueNodeRect.width / 2;
                    const middlePointOfTooltipNode = scaleTooltipElement.offsetWidth / 2;

                    const translateX =
                        adaptBoundaryRectToTranslate +
                        tooltipOffset -
                        middlePointOfTooltipNode +
                        middlePointOfMinRequiredValueNode;

                    scaleTooltipElement.style.cssText += `transform: translateY(-100%) translateX(${translateX}px)`;
                }
            });
        }, 300);
    }, []);

    return (
        <div className={cn()}>
            <div className={cn('label')}>
                {label} ({units})
            </div>

            <div className={cn('line')}>
                <div className={cn('marker')} ref={scaleMarkerRef} />

                {!isNaN(value) ? (
                    <div className={cn('tooltip')} ref={scaleTooltipRef}>
                        {value}
                    </div>
                ) : (
                    <div className={cn('na')}>Currently not available</div>
                )}
            </div>

            <div className={cn('values')} ref={scaleValuesRef}>
                {scaleValues.map(scaleValue => (
                    <div key={scaleValue.value} className={cn('value')}>
                        {scaleValue.valueString}
                    </div>
                ))}
            </div>
        </div>
    );
};
