const STEPS_TO_BOUNDARY = 3;

const isFloat = (n: number) => n % 1 !== 0;

type ScaleValue = {
    value: number;
    valueString: string;
};

type getScaleValuesOptions = {
    min: number;
    max: number;
    value: number;
    step: number;
};

export const getScaleValues = ({ min, max, value, step }: getScaleValuesOptions): ScaleValue[] => {
    const minValue = Math.min(min, value);
    const maxValue = Math.max(max, value);

    let minBoundaryValue = Math.round(minValue * 100 - step * 100 * STEPS_TO_BOUNDARY) / 100;
    let maxBoundaryValue = Math.round(maxValue * 100 + step * 100 * STEPS_TO_BOUNDARY) / 100;

    if (!isFloat(step)) {
        minBoundaryValue = Math.round(minBoundaryValue);
        maxBoundaryValue = Math.round(maxBoundaryValue);
    }

    const arrayLength = Math.ceil(maxBoundaryValue / step) + 1;

    const scaleValuesMap = Array.from({ length: arrayLength }).reduce<Record<number, ScaleValue>>(
        (carry, _, idx) => {
            let value = minBoundaryValue + idx * step;
            let valueString = String(value);

            if (isFloat(step)) {
                value = Math.round(value * 100) / 100;
                valueString = value.toFixed(1);

                if (valueString.length === 1) {
                    valueString += '.0';
                }
            }

            carry[value] = {
                value,
                valueString,
            };

            return carry;
        },
        {},
    );

    const result = Object.entries(scaleValuesMap)
        .sort(([, a], [, b]) => a.value - b.value)
        .map(([, scaleValue]) => scaleValue);

    return result;
};

type getBoundariesForValueOptions = {
    scaleValues: ScaleValue[];
    value: number;
};

export const getBoundariesForValue = ({
    scaleValues,
    value,
}: getBoundariesForValueOptions): [number, number] => {
    let minBoundaryValueIdx = 0;
    let maxBoundaryValueIdx = 0;

    for (let i = 1; i < scaleValues.length; i++) {
        const prevIdx = i - 1;

        if (scaleValues[prevIdx].value <= value && value <= scaleValues[i].value) {
            minBoundaryValueIdx = prevIdx;
            maxBoundaryValueIdx = i;

            break;
        }
    }

    return [minBoundaryValueIdx, maxBoundaryValueIdx];
};

export const getDistanceBetweenNodes = (firstNodeRect: DOMRect, secondNodeRect: DOMRect) => {
    // if the min and max value have diff length (fe 5 and 12)
    // 3 - is a offset for pre-line
    if (Math.abs(firstNodeRect.width - secondNodeRect.width) > 3) {
        return firstNodeRect.left - secondNodeRect.left + 3;
    }

    return firstNodeRect.left - secondNodeRect.left;
};
