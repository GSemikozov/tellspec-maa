import React, { useLayoutEffect, useRef } from "react";
import {
    getDistanceBetweenTwoNodes,
    getMiddlePointOfNode,
    getNodeIndexInArray,
    getScaleValues
} from "./utils";

import "./scale.css";

interface ScaleProps {
    label: string;
    value: number;
    units: string;
    minRequiredValue?: number;
    maxRequiredValue?: number;
    scaleDivisionValue?: number;
}

export const Scale: React.FC<ScaleProps> = (props) => {
    const {
        label,
        value,
        units,
        minRequiredValue = 0,
        maxRequiredValue = 3,
        scaleDivisionValue = 1,
    } = props;

    const scaleValuesRef = useRef<HTMLDivElement>(null);
    const scaleMarkerRef = useRef<HTMLDivElement>(null);
    const scaleTooltipRef = useRef<HTMLDivElement>(null);
    const scaleValues = getScaleValues(minRequiredValue, maxRequiredValue, value, scaleDivisionValue);

    useLayoutEffect(() => {
        requestAnimationFrame(() => {
            const tooltipNode = scaleTooltipRef.current;
            const scaleValuesNode = scaleValuesRef.current;
            const scaleMarkerNode = scaleMarkerRef.current;
            const valuesNodesArray = scaleValuesNode?.children || [];

            if (scaleMarkerNode) {
                // arrange okay values scale
                const maxRequiredValueIndexes = getNodeIndexInArray(scaleValues, maxRequiredValue, scaleDivisionValue);
                const [leftMaxRequiredNearestNode, rightMaxRequiredNearestNode] = maxRequiredValueIndexes;

                scaleMarkerNode.style.width =
                    getDistanceBetweenTwoNodes(scaleMarkerNode as Element, valuesNodesArray[leftMaxRequiredNearestNode]) +
                    getDistanceBetweenTwoNodes(
                        valuesNodesArray[leftMaxRequiredNearestNode],
                        valuesNodesArray[rightMaxRequiredNearestNode]
                    ) * ((maxRequiredValue - scaleValues[leftMaxRequiredNearestNode]) / scaleDivisionValue) +
                    getMiddlePointOfNode(valuesNodesArray[rightMaxRequiredNearestNode])
                    + 'px';
            }

            if (tooltipNode) {
                // arrange tooltip
                const tooltipValueIndexes = getNodeIndexInArray(scaleValues, value, scaleDivisionValue);
                const [leftTooltipNearestNode, rightTooltipNearestNode] = tooltipValueIndexes;

                tooltipNode.style.left =
                    getDistanceBetweenTwoNodes(scaleMarkerNode as Element, valuesNodesArray[leftTooltipNearestNode]) +
                    getDistanceBetweenTwoNodes(
                        valuesNodesArray[leftTooltipNearestNode],
                        valuesNodesArray[rightTooltipNearestNode]
                    ) * ((value - scaleValues[leftTooltipNearestNode]) / scaleDivisionValue) -
                    getMiddlePointOfNode(tooltipNode)
                    + 'px';
            }
        });
    }, []);

    return (
        <div className="scale">
            <div className="scale__label">{label} ({units})</div>
            <div className="scale__line">
                <div className="scale__marker" ref={scaleMarkerRef}>
                    <div className="scale__tooltip" ref={scaleTooltipRef}>{value}</div>
                </div>
            </div>
            <div className="scale__values" ref={scaleValuesRef}>
                { scaleValues.map((value) => (
                    <div key={value} className="scale__value">
                        {value % 1 === 0 ? value : value.toFixed(1)}
                    </div>)
                )}
            </div>
        </div>
    )
}
